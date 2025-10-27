'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Database, Menu, X, History, Home, Send, Loader2 } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SQLPreview } from '@/components/SQLPreview';
import { DataTable } from '@/components/DataTable';
import { ChartView } from '@/components/ChartView';
import { InsightSummary, Insight } from '@/components/InsightSummary';
import { SetupBanner } from '@/components/SetupBanner';

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

export default function ChatPage() {
  const { messages, sendMessage } = useChat();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState<any[]>([]);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [chartRecommendation, setChartRecommendation] = useState<ChartRecommendation | null>(null);

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

  useEffect(() => {
    let latestQuery: QueryResult | null = null;
    let latestInsights: Insight[] = [];
    let latestChartRec: ChartRecommendation | null = null;

    messages.forEach((message) => {
      if (message.role === 'assistant' && message.parts) {
        message.parts.forEach((part: any) => {
          if (part.type === 'tool-db' && part.state === 'output-available') {
            const result = part.output;
            if (result?.rows && Array.isArray(result.rows)) {
              const columns = result.rows.length > 0 ? Object.keys(result.rows[0]) : [];
              latestQuery = {
                data: result.rows,
                columns: columns,
                query: part.input?.query || '',
                executionTime: result.executionTime,
              };
            }
          } else if (part.type === 'tool-explain_sql' && part.state === 'output-available') {
            if (latestQuery && part.output?.explanation) {
              latestQuery.explanation = part.output.explanation;
            }
          } else if (part.type === 'tool-generate_insights' && part.state === 'output-available') {
            if (part.output?.insights) {
              latestInsights = part.output.insights;
            }
          } else if (part.type === 'tool-recommend_chart' && part.state === 'output-available') {
            if (part.output) {
              latestChartRec = part.output;
            }
          }
        });
      }
    });

    if (latestQuery) setCurrentResult(latestQuery);
    if (latestInsights.length > 0) setInsights(latestInsights);
    if (latestChartRec) setChartRecommendation(latestChartRec);

    if (latestQuery) {
      setTimeout(fetchQueryHistory, 1000);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await sendMessage({ text: input });
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <SetupBanner />

      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Home className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  AI Data Insights
                </h1>
                <p className="text-sm text-zinc-500">Chat with your data</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => {
              const textPart = message.parts?.find((p: any) => p.type === 'text') as any;
              const content = textPart?.text || '';

              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{content}</p>
                  </div>
                </div>
              );
            })}

            {currentResult && (
              <>
                <SQLPreview
                  query={currentResult.query}
                  explanation={currentResult.explanation}
                  executionTime={currentResult.executionTime}
                />

                {insights.length > 0 && (
                  <InsightSummary
                    insights={insights}
                    followUpQuestions={[]}
                    onAskQuestion={(q) => setInput(q)}
                  />
                )}

                {currentResult.data.length > 0 && chartRecommendation && (
                  <ChartView
                    data={currentResult.data}
                    columns={currentResult.columns}
                    recommendation={chartRecommendation}
                  />
                )}

                <DataTable
                  data={currentResult.data}
                  columns={currentResult.columns}
                />
              </>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing...</span>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question about your data..."
                className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>

        {showHistory && (
          <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-zinc-900 dark:text-white">Query History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {queryHistory.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">No history yet</p>
              ) : (
                queryHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setInput(item.prompt)}
                    className="w-full text-left p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2 mb-1">
                      {item.prompt}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
