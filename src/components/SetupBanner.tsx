'use client';

import { AlertCircle, Database, CheckCircle2, Settings, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DatabaseInfo {
    configured: boolean;
    type?: string;
    database?: string;
    host?: string;
}

export function DatabaseStatusBanner() {
    const [isLoading, setIsLoading] = useState(true);
    const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null);
    const [isSeeding, setIsSeeding] = useState(false);
    const [seedStatus, setSeedStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        fetchDatabaseStatus();
    }, []);

    const fetchDatabaseStatus = async () => {
        try {
            const response = await fetch('/api/save-connection');
            const data = await response.json();
            setDatabaseInfo(data);
        } catch (error) {
            setDatabaseInfo({ configured: false });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            const response = await fetch('/api/seed');
            const data = await response.json();

            if (data.success) {
                setSeedStatus('success');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setSeedStatus('error');
            }
        } catch (error) {
            console.error('Seed error:', error);
            setSeedStatus('error');
        } finally {
            setIsSeeding(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 px-6 py-2">
                <div className="flex items-center gap-2 max-w-7xl mx-auto">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    <span className="text-sm text-zinc-500">Loading database status...</span>
                </div>
            </div>
        );
    }

    if (dismissed || seedStatus === 'success') return null;

    // No database configured
    if (!databaseInfo?.configured) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-200 dark:border-blue-900 px-6 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                No database connected
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Connect your database to query your own data
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/setup"
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 flex items-center gap-2"
                        >
                            <Database className="w-4 h-4" />
                            Connect Database
                        </Link>
                        <button
                            onClick={() => setDismissed(true)}
                            className="px-3 py-2 text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Database configured - show status
    const databaseLabel = databaseInfo.database || databaseInfo.host || databaseInfo.type;

    return (
        <div className="bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-900 px-6 py-2">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                        Connected to <strong className="font-mono">{databaseLabel}</strong>
                        <span className="ml-2 text-green-600 dark:text-green-400 text-xs">
                            ({databaseInfo.type})
                        </span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {seedStatus === 'idle' && (
                        <button
                            onClick={handleSeed}
                            disabled={isSeeding}
                            className="px-3 py-1.5 text-xs text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors flex items-center gap-1"
                        >
                            {isSeeding ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                    Seeding...
                                </>
                            ) : (
                                'Seed Sample Data'
                            )}
                        </button>
                    )}
                    {seedStatus === 'error' && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Seed failed
                        </span>
                    )}
                    <Link
                        href="/setup"
                        className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                        title="Database settings"
                    >
                        <Settings className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Keep backward compatibility
export { DatabaseStatusBanner as SetupBanner };
