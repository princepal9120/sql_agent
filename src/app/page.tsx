'use client';

import Link from 'next/link';
import { Database, Zap, BarChart3, Brain, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-blue-950">
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              AI Data Insights
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link
              href="/chat"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
              Turn Data Into <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Insights</span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
              Ask questions in plain English. Get instant SQL queries, visualizations, and AI analysis.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all hover:scale-105"
            >
              Start Analyzing Data
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
