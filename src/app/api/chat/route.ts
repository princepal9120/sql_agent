import { db } from '@/db/db';
import { queryHistoryTable } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import z from 'zod';
import { 
  validateAndSanitizeSQL, 
  generateSQLExplanation, 
  suggestSQLCorrection 
} from '@/lib/sqlValidator';
import { recommendChartType } from '@/lib/chartRecommender';
import { generateInsights, generateFollowUpQuestions } from '@/lib/insightGenerator';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const startTime = Date.now();
    
    // Helper to get last user message text
    const getLastUserMessage = () => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && 'parts' in lastMsg) {
            const textPart = lastMsg.parts?.find((p: any) => p.type === 'text') as any;
            return textPart?.text || '';
        }
        return '';
    };
    const lastPrompt = getLastUserMessage();

    const SYSTEM_PROMPT = `You are an expert AI Data Analyst that helps users understand their data through natural language conversations.

Current date/time: ${new Date().toLocaleString('sv-SE')}

You have access to following tools:
1. **schema** - Get database schema to understand available tables and columns
2. **db** - Execute SQL queries (SELECT only) to retrieve data
3. **explain_sql** - Explain why you generated specific SQL
4. **generate_insights** - Generate AI insights from query results
5. **recommend_chart** - Suggest best visualization for data

Workflow:
1. For complex questions, break them into smaller sub-questions
2. Use schema tool first if you need to understand table structure
3. Generate and execute SQL using db tool
4. ALWAYS call explain_sql after generating SQL
5. After getting results, call generate_insights to provide analysis
6. Call recommend_chart to suggest visualization
7. Provide a conversational summary with key findings

Rules:
- Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP, ALTER)
- Always validate queries before execution
- If a query fails, analyze the error and suggest corrections
- Provide insights in plain English (e.g., "Revenue increased 15% vs last quarter")
- Be proactive: suggest follow-up questions
- Keep responses conversational yet technically accurate

Remember: Your goal is to help users discover insights, not just run queries.`;

    const result = streamText({
        model: openai('gpt-5-nano-2025-08-07'),
        messages: convertToModelMessages(messages),
        system: SYSTEM_PROMPT,
        tools: {
            schema: tool({
                description: 'Get database schema information including tables, columns, and relationships.',
                inputSchema: z.object({}),
                execute: async () => {
                    return `CREATE TABLE products (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	name text NOT NULL,
	category text NOT NULL,
	price real NOT NULL,
	stock integer DEFAULT 0 NOT NULL,
	created_at text DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE sales (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	product_id integer NOT NULL,
	quantity integer NOT NULL,
	total_amount real NOT NULL,
	sale_date text DEFAULT CURRENT_TIMESTAMP,
	customer_name text NOT NULL,
	region text NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
)`;
                },
            }),
            
            db: tool({
                description: 'Execute a SQL SELECT query against the database. Query will be automatically validated for safety.',
                inputSchema: z.object({
                    query: z.string().describe('The SQL SELECT query to execute'),
                }),
                execute: async ({ query }) => {
                    const queryStartTime = Date.now();
                    
                    try {
                        // Validate and sanitize SQL
                        const validation = validateAndSanitizeSQL(query);
                        
                        if (!validation.isValid) {
                            const correction = suggestSQLCorrection(query, validation.error || '');
                            
                            // Log failed query
                            await db.insert(queryHistoryTable).values({
                                user_id: 'anonymous',
                                prompt: lastPrompt,
                                sql_query: query,
                                status: 'error',
                                error_message: validation.error,
                                execution_time_ms: Date.now() - queryStartTime,
                            }).catch(console.error);
                            
                            return {
                                error: validation.error,
                                suggestion: correction,
                                rows: [],
                            };
                        }
                        
                        // Execute sanitized query
                        const result = await db.run(validation.sanitizedQuery || query);
                        const executionTime = Date.now() - queryStartTime;
                        
                        // Log successful query
                        await db.insert(queryHistoryTable).values({
                            user_id: 'anonymous',
                            prompt: lastPrompt,
                            sql_query: validation.sanitizedQuery || query,
                            result_count: result.rows?.length || 0,
                            execution_time_ms: executionTime,
                            status: 'success',
                        }).catch(console.error);
                        
                        return {
                            ...result,
                            executionTime,
                        };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        const executionTime = Date.now() - queryStartTime;
                        
                        // Log error
                        await db.insert(queryHistoryTable).values({
                            user_id: 'anonymous',
                            prompt: lastPrompt,
                            sql_query: query,
                            status: 'error',
                            error_message: errorMessage,
                            execution_time_ms: executionTime,
                        }).catch(console.error);
                        
                        const correction = suggestSQLCorrection(query, errorMessage);
                        
                        return {
                            error: errorMessage,
                            suggestion: correction,
                            rows: [],
                        };
                    }
                },
            }),
            
            explain_sql: tool({
                description: 'Generate a plain English explanation of what a SQL query does and why it was generated.',
                inputSchema: z.object({
                    query: z.string().describe('The SQL query to explain'),
                }),
                execute: async ({ query }) => {
                    const explanation = generateSQLExplanation(query);
                    return {
                        explanation,
                        query,
                    };
                },
            }),
            
            generate_insights: tool({
                description: 'Analyze query results and generate AI-powered insights, trends, and summaries.',
                inputSchema: z.object({
                    data: z.array(z.any()).describe('The query result data'),
                    columns: z.array(z.string()).describe('Column names from the result'),
                    query: z.string().describe('The original SQL query'),
                }),
                execute: async ({ data, columns, query }) => {
                    const insights = generateInsights(data, columns, query);
                    const followUpQuestions = generateFollowUpQuestions(data, columns, query);
                    
                    return {
                        insights,
                        followUpQuestions,
                    };
                },
            }),
            
            recommend_chart: tool({
                description: 'Analyze data and recommend the best chart type for visualization.',
                inputSchema: z.object({
                    data: z.array(z.any()).describe('The query result data'),
                    columns: z.array(z.string()).describe('Column names from the result'),
                }),
                execute: async ({ data, columns }) => {
                    const recommendation = recommendChartType(data, columns);
                    return recommendation;
                },
            }),
        },
        onFinish: async ({ usage }) => {
            // Log token usage
            const totalTime = Date.now() - startTime;
            console.log(`Request completed in ${totalTime}ms, tokens used:`, usage);
        },
    });

    return result.toUIMessageStreamResponse();
}