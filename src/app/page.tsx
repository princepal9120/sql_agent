'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import {
  Database,
  Zap,
  BarChart3,
  Brain,
  ArrowRight,
  Sparkles,
  Shield,
  MessageSquare,
  Code2,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-200/50 dark:border-zinc-800/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative p-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <NextImage src="/logo.png" alt="SQL Agent Logo" width={32} height={32} className="w-8 h-8 rounded-md" />
              </div>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              SQL Agent
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#features" className="hidden md:inline-flex text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Features
            </Link>
            <a
              href="https://github.com/princepal9120/sql_agent"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <ThemeSwitcher />
            <Link
              href="/chat"
              className="relative group px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sky-500/25 overflow-hidden"
            >
              <span className="relative z-10">Start Chatting</span>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-full text-sky-600 dark:text-sky-400 text-sm font-medium mb-8 border border-sky-200/50 dark:border-sky-800/50">
            <Sparkles className="w-4 h-4" />
            <span>Open Source • Self-Hosted</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-8 leading-tight">
            Chat with Your{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Database
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-sky-600/20 via-blue-600/20 to-indigo-600/20 blur-lg"></span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed max-w-3xl mx-auto">
            Ask questions in plain English. Get SQL queries, interactive charts, and actionable insights—instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/setup"
              className="group relative px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-sky-500/25 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Connect Your Database
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/chat"
              className="group px-8 py-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 border-2 border-zinc-200 dark:border-zinc-700 flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Try Demo
            </Link>
          </div>

          {/* Supported Databases */}
          <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Works with:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <span className="text-xl">🐘</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <span className="text-xl">🐬</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">MySQL</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <span className="text-xl">📦</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">SQLite</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <span className="text-xl">🚀</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Turso</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
              How it{' '}
              <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                works
              </span>
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Connect your database, ask questions, get answers. It's that simple.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              { icon: Code2, title: 'Natural Language to SQL', desc: 'Describe what you need in plain English, get the exact query.' },
              { icon: BarChart3, title: 'Auto Visualizations', desc: 'Charts are generated automatically based on your data.' },
              { icon: Zap, title: 'Multi-Database Support', desc: 'PostgreSQL, MySQL, SQLite, and Turso out of the box.' },
              { icon: Shield, title: 'Privacy First', desc: 'Self-hosted. Your data never leaves your infrastructure.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 bg-white/50 dark:bg-zinc-800/50 backdrop-blur rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="inline-flex p-3 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Ready to talk to your data?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12">
            Set up in under 2 minutes. No account required.
          </p>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-lg rounded-2xl font-semibold transition-all hover:scale-105 shadow-2xl shadow-sky-500/25"
          >
            Get Started
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            Free & open source • Self-hosted • No data collection
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white dark:bg-black rounded-lg border border-zinc-200 dark:border-zinc-800">
              <NextImage src="/logo.png" alt="SQL Agent Logo" width={20} height={20} className="w-5 h-5 rounded-sm" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">SQL Agent</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-600 dark:text-zinc-400">
            <a
              href="https://github.com/princepal9120/sql_agent"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link href="/setup" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Setup
            </Link>
            <Link href="/chat" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Chat
            </Link>
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Built with Next.js, Drizzle ORM & AI SDK
          </div>
        </div>
      </footer>
    </div>
  );
}

