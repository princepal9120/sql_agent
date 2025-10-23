import { db } from '@/db/db';
import { queryHistoryTable } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
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
        stopWhen: stepCountIs(5),
        tools: {
            schema: tool({
                description: 'Call this tool to get database schema information.',
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
                description: 'Call this tool to query a database.',
                inputSchema: z.object({
                    query: z.string().describe('The SQL query to be ran.'),
                }),
                execute: async ({ query }) => {
                    console.log('Query', query);
                    // Important: make sure you sanitize / validate (somehow) check the query
                    // string search [delete, update] -> Guardrails
                    return await db.run(query);
                },
            }),
        },
    });

    return result.toUIMessageStreamResponse();
}