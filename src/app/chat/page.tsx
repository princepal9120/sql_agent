'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Database, X, History, Home, Send, Loader2 } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SQLPreview } from '@/components/SQLPreview';
import { DataTable } from '@/components/DataTable';
import { ChartView } from '@/components/ChartView';
import { InsightSummary, Insight } from '@/components/InsightSummary';
import { SetupBanner } from '@/components/SetupBanner';

// Helper interface for grouped tool outputs
interface ToolOutputs {
  query?: {
    data: any[];
    columns: string[];
    query: string;
    executionTime: number;
    explanation?: string;
  };
  insights?: Insight[];
  followUpQuestions?: string[];
  chartRecommendation?: {
    type: 'bar' | 'line' | 'pie' | 'area' | 'table';
    reason: string;
    xAxis?: string;
    yAxis?: string;
  };
}

export default function ChatPage() {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQueryHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  // Helper to group tool parts from a message
  const getToolOutputs = (message: any): ToolOutputs => {
    const outputs: ToolOutputs = {};
    if (!message.parts) return outputs;

    message.parts.forEach((part: any) => {
      if (part.type === 'tool-db' && part.state === 'output-available') {
        const result = part.output;
        if (result?.rows && Array.isArray(result.rows)) {
          const columns = result.rows.length > 0 ? Object.keys(result.rows[0]) : [];
          outputs.query = {
            data: result.rows,
            columns: columns,
            query: part.input?.query || '',
            executionTime: result.executionTime,
          };
        }
      }
      if (part.type === 'tool-explain_sql' && part.state === 'output-available') {
        if (outputs.query && part.output?.explanation) {
          outputs.query.explanation = part.output.explanation;
        }
      }
      if (part.type === 'tool-generate_insights' && part.state === 'output-available') {
        if (part.output?.insights) {
          outputs.insights = part.output.insights;
        }
        if (part.output?.followUpQuestions) {
          outputs.followUpQuestions = part.output.followUpQuestions;
        }
      }
      if (part.type === 'tool-recommend_chart' && part.state === 'output-available') {
        if (part.output) {
          outputs.chartRecommendation = part.output;
        }
      }
    });
    return outputs;
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <SetupBanner />

      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex-shrink-0">
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
                  Sql Agentsights
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
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                <Database className="w-16 h-16 text-zinc-300" />
                <div>
                  <h3 className="text-lg font-medium">No messages yet</h3>
                  <p>Start asking questions about your data.</p>
                </div>
              </div>
            )}

            {messages.map((message) => {
              const textPart = message.parts?.find((p: any) => p.type === 'text') as any;
              const content = textPart?.text || ((message as any).content !== 'Unknown' ? (message as any).content : ''); // Fallback content
              const outputs = getToolOutputs(message);
              const hasTools = outputs.query || outputs.insights || outputs.chartRecommendation;

              // Check if message has any non-text parts (tool calls) even if we don't render specific UI for them yet
              const hasToolCalls = message.parts?.some((p: any) => p.type.startsWith('tool-'));

              if (!content && !hasTools && !hasToolCalls) return null;

              return (
                <div key={message.id} className="space-y-4">
                  {/* Text Message Bubble */}
                  {content && (
                    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800'
                          }`}
                      >
                        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                          {content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Show loader/status if tool calls are present but no visual output yet */}
                  {!content && hasToolCalls && !hasTools && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 shadow-sm opacity-70">
                        <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
                        <span className="text-xs text-zinc-500">Processing...</span>
                      </div>
                    </div>
                  )}    {/* Tool Outputs (Charts, Tables, etc.) - Only for Assistant */}
                  {message.role === 'assistant' && hasTools && (
                    <div className="pl-0 md:pl-4 space-y-6 animate-in fade-in duration-500">
                      {outputs.query && (
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-white dark:bg-zinc-900">
                          <SQLPreview
                            query={outputs.query.query}
                            explanation={outputs.query.explanation}
                            executionTime={outputs.query.executionTime}
                          />
                        </div>
                      )}

                      {outputs.insights && outputs.insights.length > 0 && (
                        <InsightSummary
                          insights={outputs.insights}
                          followUpQuestions={outputs.followUpQuestions || []}
                          onAskQuestion={(q) => setInput(q)}
                        />
                      )}

                      {/* Visualization Section - ChartView now includes Table view toggle */}
                      {outputs.query && outputs.query.data.length > 0 && (
                        <ChartView
                          data={outputs.query.data}
                          columns={outputs.query.columns}
                          recommendation={outputs.chartRecommendation}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Analyzing data...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900/95 backdrop-blur-sm z-10">
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto w-full">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your data..." // e.g., 'Show total sales by region'"
                className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white transition-all shadow-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>

        {showHistory && (
          <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-4 flex-shrink-0 absolute right-0 top-0 bottom-0 md:static z-20 shadow-lg md:shadow-none transform transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-zinc-900 dark:text-white">Query History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500"
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
                    onClick={() => {
                      setInput(item.prompt);
                      // Optional: autoclose history on mobile
                      if (window.innerWidth < 768) setShowHistory(false);
                    }}
                    className="w-full text-left p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
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
