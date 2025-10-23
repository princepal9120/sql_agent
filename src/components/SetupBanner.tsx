'use client';

import { AlertCircle, Database, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function SetupBanner() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [seedStatus, setSeedStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [dismissed, setDismissed] = useState(false);

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

    if (dismissed || seedStatus === 'success') return null;

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-900 px-6 py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    {seedStatus === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                        <Database className="w-5 h-5 text-blue-500" />
                    )}
                    <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {seedStatus === 'idle' && 'Database is empty'}
                            {seedStatus === 'error' && 'Failed to seed database'}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            {seedStatus === 'idle' && 'Click the button to populate with sample data →'}
                            {seedStatus === 'error' && 'Please check your database connection and try again'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSeeding ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Seeding...
                            </>
                        ) : (
                            <>
                                <Database className="w-4 h-4" />
                                Seed Database
                            </>
                        )}
                    </button>
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
