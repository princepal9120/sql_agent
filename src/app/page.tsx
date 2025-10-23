'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import { Database, Menu, X } from 'lucide-react';
import { ChatPanel } from '@/components/ChatPanel';
import { SQLPreview } from '@/components/SQLPreview';
import { DataTable } from '@/components/DataTable';
import { ChartView } from '@/components/ChartView';
import { InsightSummary, Insight } from '@/components/InsightSummary';
import { QueryHistory } from '@/components/QueryHistory';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SetupBanner } from '@/components/SetupBanner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QueryResult {
  data: any[];
  columns: string[];
  query: string;
  explanation?: string;
  executionTime?: number;
}

interface ChartRecommendation {
  type: 'bar' | 'line' | 'pie' | 'area' | 'table';
  reason: string;
  xAxis?: string;
  yAxis?: string;
}

export default function Dashboard() {
  const { messages, sendMessage } = useChat();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [chartRecommendation, setChartRecommendation] = useState<ChartRecommendation | null>(null);
  const [queryHistory, setQueryHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Load query history on mount
  useEffect(() => {
    fetchQueryHistory();
  }, []);

  const fetchQueryHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const data = await response.json();
        setQueryHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch query history:', error);
    }
  };

  // Process AI messages to extract data
  useEffect(() => {
    const processedMessages: ChatMessage[] = [];
    let latestQuery: QueryResult | null = null;
    let latestInsights: Insight[] = [];
    let latestFollowUps: string[] = [];
    let latestChartRec: ChartRecommendation | null = null;

    messages.forEach((message) => {
      if (message.role === 'user') {
        const textPart = message.parts?.find((p: any) => p.type === 'text') as any;
        if (textPart?.text) {
          processedMessages.push({
            id: message.id,
            role: 'user',
            content: textPart.text,
            timestamp: new Date(),
          });
        }
      } else if (message.role === 'assistant') {
        let assistantContent = '';

        message.parts?.forEach((part: any) => {
          if (part.type === 'text') {
            assistantContent += part.text + '\n';
          } else if (part.type === 'tool-db' && part.state === 'output-available') {
            const output = part.output as any;
            if (output?.rows && Array.isArray(output.rows)) {
              const columns = output.rows.length > 0 ? Object.keys(output.rows[0]) : [];
              latestQuery = {
                data: output.rows,
                columns: columns,
                query: (part.input as any)?.query || '',
                executionTime: output.executionTime,
              };
            }
          } else if (part.type === 'tool-explain_sql' && part.state === 'output-available') {
            const output = part.output as any;
            if (latestQuery && output?.explanation) {
              latestQuery.explanation = output.explanation;
            }
          } else if (part.type === 'tool-generate_insights' && part.state === 'output-available') {
            const output = part.output as any;
            if (output?.insights) {
              latestInsights = output.insights;
            }
            if (output?.followUpQuestions) {
              latestFollowUps = output.followUpQuestions;
            }
          } else if (part.type === 'tool-recommend_chart' && part.state === 'output-available') {
            const output = part.output as any;
            if (output) {
              latestChartRec = output;
            }
          }
        });

        if (assistantContent.trim()) {
          processedMessages.push({
            id: message.id,
            role: 'assistant',
            content: assistantContent.trim(),
            timestamp: new Date(),
          });
        }
      }
    });

    setChatMessages(processedMessages);
    if (latestQuery) setCurrentResult(latestQuery);
    if (latestInsights.length > 0) setInsights(latestInsights);
    if (latestFollowUps.length > 0) setFollowUpQuestions(latestFollowUps);
    if (latestChartRec) setChartRecommendation(latestChartRec);

    // Refresh history after new query
    if (latestQuery) {
      setTimeout(fetchQueryHistory, 1000);
    }
  }, [messages]);

  const handleSendMessage = (text: string) => {
    sendMessage({ text });
  };

  const handleAskFollowUp = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <SetupBanner />
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                AI Data Insights Platform
              </h1>
              <p className="text-sm text-zinc-500">
                Ask questions, visualize data, discover insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              History {showHistory ? '✓' : ''}
            </button>
            <ThemeSwitcher />
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - Left Sidebar */}
        <div className={`w-full lg:w-96 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
          <ChatPanel
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={false}
          />
        </div>

        {/* Main Dashboard Area */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${showMobileMenu ? 'hidden' : 'block'}`}>
          {/* SQL Preview */}
          {currentResult && (
            <SQLPreview
              query={currentResult.query}
              explanation={currentResult.explanation}
              executionTime={currentResult.executionTime}
            />
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <InsightSummary
              insights={insights}
              followUpQuestions={followUpQuestions}
              onAskQuestion={handleAskFollowUp}
            />
          )}

          {/* Visualization */}
          {currentResult && currentResult.data.length > 0 && (
            <ChartView
              data={currentResult.data}
              columns={currentResult.columns}
              recommendation={chartRecommendation || undefined}
            />
          )}

          {/* Data Table */}
          {currentResult && (
            <DataTable
              data={currentResult.data}
              columns={currentResult.columns}
            />
          )}

          {/* Empty State */}
          {!currentResult && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <Database className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Welcome to AI Data Insights
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Start by asking a question about your data in the chat panel.
                  I'll help you query, visualize, and understand your database.
                </p>
                <div className="grid grid-cols-1 gap-3 text-left">
                  {[
                    '📊 Generate SQL from natural language',
                    '📈 Visualize results with smart charts',
                    '💡 Get AI-powered insights and trends',
                    '📝 Track and replay query history',
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
                    >
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Query History - Right Sidebar */}
        {showHistory && (
          <div className="hidden lg:block w-80">
            <QueryHistory
              history={queryHistory}
              onSelectQuery={(query) => {
                handleSendMessage(query.prompt);
                setShowHistory(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}