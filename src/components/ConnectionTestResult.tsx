'use client';

import { CheckCircle2, XCircle, Loader2, Database, RefreshCw } from 'lucide-react';

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';

interface ConnectionTestResultProps {
    status: ConnectionStatus;
    message?: string;
    tables?: string[];
    onRetry?: () => void;
}

export function ConnectionTestResult({ status, message, tables, onRetry }: ConnectionTestResultProps) {
    if (status === 'idle') {
        return (
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center">
                <Database className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
                <p className="text-zinc-500 dark:text-zinc-400">
                    Click "Test Connection" to verify your database settings
                </p>
            </div>
        );
    }

    if (status === 'testing') {
        return (
            <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Testing connection...
                    </span>
                </div>
                <p className="text-center text-sm text-blue-600 dark:text-blue-400 mt-2">
                    This may take a few seconds
                </p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-green-700 dark:text-green-300">
                            Connection Successful!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                            {message || 'Your database is ready to use'}
                        </p>
                    </div>
                </div>

                {tables && tables.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                            Tables found ({tables.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {tables.slice(0, 10).map((table) => (
                                <span
                                    key={table}
                                    className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-md font-mono"
                                >
                                    {table}
                                </span>
                            ))}
                            {tables.length > 10 && (
                                <span className="px-2 py-1 text-green-600 dark:text-green-400 text-xs">
                                    +{tables.length - 10} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-semibold text-red-700 dark:text-red-300">
                            Connection Failed
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {message || 'Unable to connect to the database'}
                        </p>
                    </div>
                </div>

                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 text-red-700 dark:text-red-300 rounded-lg transition-colors text-sm font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                )}

                <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                        Troubleshooting tips:
                    </p>
                    <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                        <li>Check if the database server is running</li>
                        <li>Verify the host and port are correct</li>
                        <li>Ensure the credentials are valid</li>
                        <li>Check if firewall allows the connection</li>
                    </ul>
                </div>
            </div>
        );
    }

    return null;
}
