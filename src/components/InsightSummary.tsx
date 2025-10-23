'use client';

import { Lightbulb, TrendingUp, AlertCircle, BarChart2, MessageSquare } from 'lucide-react';

export interface Insight {
    type: 'summary' | 'trend' | 'comparison' | 'anomaly' | 'recommendation';
    text: string;
    confidence: 'high' | 'medium' | 'low';
}

interface InsightSummaryProps {
    insights: Insight[];
    followUpQuestions?: string[];
    onAskQuestion?: (question: string) => void;
}

const insightIcons = {
    summary: BarChart2,
    trend: TrendingUp,
    comparison: BarChart2,
    anomaly: AlertCircle,
    recommendation: Lightbulb,
};

const insightColors = {
    summary: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900',
    trend: 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900',
    comparison: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900',
    anomaly: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900',
    recommendation: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-900',
};

const confidenceBadges = {
    high: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
};

export function InsightSummary({ insights, followUpQuestions, onAskQuestion }: InsightSummaryProps) {
    if (!insights || insights.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                    <Lightbulb className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-3" />
                    <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                        No insights yet
                    </h3>
                    <p className="text-sm text-zinc-500">
                        Run a query to get AI-generated insights
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                    AI Insights
                </h3>
            </div>

            {/* Insights */}
            <div className="p-4 space-y-3">
                {insights.map((insight, index) => {
                    const Icon = insightIcons[insight.type];
                    const colorClass = insightColors[insight.type];
                    const confidenceClass = confidenceBadges[insight.confidence];

                    return (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${colorClass}`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">
                                        {insight.type}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${confidenceClass}`}
                                    >
                                        {insight.confidence}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                    {insight.text}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Follow-up Questions */}
            {followUpQuestions && followUpQuestions.length > 0 && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Ask a follow-up question
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {followUpQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => onAskQuestion?.(question)}
                                className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
