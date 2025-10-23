'use client';

import { History, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface QueryHistoryItem {
    id: number;
    prompt: string;
    sql_query: string | null;
    result_count: number | null;
    execution_time_ms: number | null;
    status: string;
    created_at: string;
}

interface QueryHistoryProps {
    history: QueryHistoryItem[];
    onSelectQuery?: (query: QueryHistoryItem) => void;
}

export function QueryHistory({ history, onSelectQuery }: QueryHistoryProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHistory = history.filter(
        (item) =>
            item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sql_query?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-3">
                    <History className="w-5 h-5 text-blue-500" />
                    <h2 className="font-semibold text-zinc-900 dark:text-white">
                        Query History
                    </h2>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search queries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white placeholder-zinc-500"
                    />
                </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <History className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-3" />
                        <p className="text-sm text-zinc-500">
                            {searchTerm ? 'No queries match your search' : 'No query history yet'}
                        </p>
                    </div>
                ) : (
                    filteredHistory.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelectQuery?.(item)}
                            className="w-full text-left p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors"
                        >
                            {/* Status and Time */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {item.status === 'success' ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className="text-xs text-zinc-500">
                                        {format(new Date(item.created_at), 'MMM d, h:mm a')}
                                    </span>
                                </div>
                                {item.execution_time_ms && (
                                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                                        <Clock className="w-3 h-3" />
                                        {item.execution_time_ms}ms
                                    </div>
                                )}
                            </div>

                            {/* Prompt */}
                            <p className="text-sm text-zinc-900 dark:text-white font-medium mb-1 line-clamp-2">
                                {item.prompt}
                            </p>

                            {/* SQL Preview */}
                            {item.sql_query && (
                                <pre className="text-xs text-zinc-600 dark:text-zinc-400 font-mono bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-700 overflow-hidden line-clamp-2">
                                    {item.sql_query}
                                </pre>
                            )}

                            {/* Result Count */}
                            {item.result_count !== null && item.status === 'success' && (
                                <p className="text-xs text-zinc-500 mt-2">
                                    {item.result_count} row{item.result_count !== 1 ? 's' : ''} returned
                                </p>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
