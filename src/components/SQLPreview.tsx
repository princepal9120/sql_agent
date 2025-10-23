'use client';

import { Code2, Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';

interface SQLPreviewProps {
    query: string;
    explanation?: string;
    executionTime?: number;
}

export function SQLPreview({ query, explanation, executionTime }: SQLPreviewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(query);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!query) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600">
                    <Code2 className="w-5 h-5" />
                    <span className="text-sm">No SQL query generated yet</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                        Generated SQL
                    </h3>
                    {executionTime !== undefined && (
                        <span className="text-xs text-zinc-500 ml-2">
                            Executed in {executionTime}ms
                        </span>
                    )}
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-md transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* SQL Query */}
            <div className="p-4">
                <pre className="text-sm bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg overflow-x-auto border border-zinc-200 dark:border-zinc-800">
                    <code className="text-zinc-800 dark:text-zinc-200 font-mono">
                        {query}
                    </code>
                </pre>
            </div>

            {/* Explanation */}
            {explanation && (
                <div className="px-4 pb-4">
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">
                                Why this SQL?
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                {explanation}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
