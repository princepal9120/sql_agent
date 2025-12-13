'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { Database, ArrowRight, Sparkles } from 'lucide-react';
import { DatabaseWizard } from '@/components/DatabaseWizard';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function SetupPage() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/chat');
    };

    const handleCancel = () => {
        router.push('/');
    };

    const handleUseDemo = async () => {
        // Use the default Turso demo database
        try {
            const response = await fetch('/api/save-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'turso',
                    url: process.env.NEXT_PUBLIC_DEMO_DATABASE_URL || 'demo',
                    authToken: process.env.NEXT_PUBLIC_DEMO_AUTH_TOKEN || 'demo',
                }),
            });

            if (response.ok) {
                router.push('/chat');
            }
        } catch (error) {
            console.error('Failed to set demo database:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="p-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <NextImage src="/logo.png" alt="SQL Agent Logo" width={32} height={32} className="w-8 h-8 rounded-md" />
                    </div>
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">
                        SQL Agent
                    </span>
                </Link>
                <ThemeSwitcher />
            </header>

            {/* Main Content */}
            <main className="relative z-10 px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Quick Setup</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                            Connect Your Database
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Start querying your data in seconds. Just pick your database, enter credentials, and you're ready.
                        </p>
                    </div>

                    {/* Option: Use Demo */}
                    <div className="mb-8 text-center">
                        <button
                            onClick={handleUseDemo}
                            className="inline-flex items-center gap-2 px-6 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            <span>Want to explore first?</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                Use Demo Database
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Wizard */}
                    <DatabaseWizard
                        onComplete={handleComplete}
                        onCancel={handleCancel}
                    />

                    {/* Skip link */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/chat"
                            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                            Skip for now →
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
