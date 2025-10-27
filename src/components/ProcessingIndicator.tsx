'use client';

import { Loader2, Database, Code2, Lightbulb, BarChart3, CheckCircle2 } from 'lucide-react';

interface ProcessingStatus {
    step: 'schema' | 'sql' | 'executing' | 'insights' | 'chart' | 'complete' | 'idle';
    message: string;
}

interface ProcessingIndicatorProps {
    status: ProcessingStatus;
}

export function ProcessingIndicator({ status }: ProcessingIndicatorProps) {
    if (status.step === 'idle') return null;

    const steps = [
        { key: 'schema', icon: Database, label: 'Loading Schema', color: 'text-purple-500' },
        { key: 'sql', icon: Code2, label: 'Generating SQL', color: 'text-blue-500' },
        { key: 'executing', icon: Database, label: 'Executing Query', color: 'text-green-500' },
        { key: 'insights', icon: Lightbulb, label: 'Analyzing Results', color: 'text-amber-500' },
        { key: 'chart', icon: BarChart3, label: 'Creating Visualization', color: 'text-pink-500' },
        { key: 'complete', icon: CheckCircle2, label: 'Complete', color: 'text-green-500' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === status.step);
    const CurrentIcon = steps.find((s) => s.key === status.step)?.icon || Loader2;
    const currentColor = steps.find((s) => s.key === status.step)?.color || 'text-blue-500';

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 mb-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <div className={`${currentColor}`}>
                    {status.step === 'complete' ? (
                        <CheckCircle2 className="w-6 h-6" />
                    ) : (
                        <CurrentIcon className="w-6 h-6 animate-pulse" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-zinc-900 dark:text-white">{status.message}</p>
                    {status.step !== 'complete' && (
                        <p className="text-xs text-zinc-500 mt-1">Processing your request...</p>
                    )}
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isComplete = index < currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex items-center flex-1">
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${isComplete
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : isActive
                                            ? `border-current ${step.color} bg-white dark:bg-zinc-900`
                                            : 'border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600'
                                    }`}
                            >
                                {isComplete ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-2 transition-colors ${isComplete ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step Labels - Only show on larger screens */}
            <div className="hidden md:flex items-center gap-2 mt-2">
                {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center flex-1">
                        <p
                            className={`text-xs text-center w-full ${index === currentStepIndex
                                    ? 'text-zinc-900 dark:text-white font-medium'
                                    : index < currentStepIndex
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-zinc-500 dark:text-zinc-500'
                                }`}
                        >
                            {step.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
