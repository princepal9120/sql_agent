'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Database, Check, Loader2 } from 'lucide-react';
import { DatabaseTypeSelector } from './DatabaseTypeCard';
import { ConnectionFormFields } from './ConnectionFormFields';
import { ConnectionTestResult } from './ConnectionTestResult';
import type { DatabaseType, DatabaseConfig } from '@/lib/db-types';

type WizardStep = 'select' | 'configure' | 'test' | 'complete';

interface DatabaseWizardProps {
    onComplete?: () => void;
    onCancel?: () => void;
}

const steps: { key: WizardStep; label: string }[] = [
    { key: 'select', label: 'Select Database' },
    { key: 'configure', label: 'Configure' },
    { key: 'test', label: 'Test Connection' },
    { key: 'complete', label: 'Complete' },
];

export function DatabaseWizard({ onComplete, onCancel }: DatabaseWizardProps) {
    const [currentStep, setCurrentStep] = useState<WizardStep>('select');
    const [selectedType, setSelectedType] = useState<DatabaseType | null>(null);
    const [config, setConfig] = useState<Partial<DatabaseConfig>>({});
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [connectionMessage, setConnectionMessage] = useState('');
    const [tables, setTables] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const stepIndex = steps.findIndex(s => s.key === currentStep);

    const handleTypeSelect = (type: DatabaseType) => {
        setSelectedType(type);
        setConfig({ type });
    };

    const handleConfigChange = (newConfig: Partial<DatabaseConfig>) => {
        setConfig({ ...newConfig, type: selectedType || undefined });
    };

    const handleTestConnection = async () => {
        if (!selectedType) return;

        setConnectionStatus('testing');
        setConnectionMessage('');
        setTables([]);

        try {
            const response = await fetch('/api/test-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...config, type: selectedType }),
            });

            const result = await response.json();

            if (result.success) {
                setConnectionStatus('success');
                setConnectionMessage(result.message);
                setTables(result.tables || []);
            } else {
                setConnectionStatus('error');
                setConnectionMessage(result.error || result.message);
            }
        } catch (error) {
            setConnectionStatus('error');
            setConnectionMessage('Network error. Please check your connection.');
        }
    };

    const handleSaveConnection = async () => {
        if (!selectedType) return;

        setIsSaving(true);

        try {
            const response = await fetch('/api/save-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...config, type: selectedType }),
            });

            const result = await response.json();

            if (result.success) {
                setCurrentStep('complete');
            } else {
                setConnectionStatus('error');
                setConnectionMessage(result.error || 'Failed to save configuration');
            }
        } catch (error) {
            setConnectionMessage('Network error. Please check your connection.');
        } finally {
            setIsSaving(false);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 'select':
                return selectedType !== null;
            case 'configure':
                return true; // Basic validation - full validation happens on test
            case 'test':
                return connectionStatus === 'success';
            default:
                return true;
        }
    };

    const handleNext = () => {
        const nextIndex = stepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].key);
            if (steps[nextIndex].key === 'test') {
                handleTestConnection();
            }
        }
    };

    const handleBack = () => {
        const prevIndex = stepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex].key);
            if (currentStep === 'test') {
                setConnectionStatus('idle');
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.key} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-200
                    ${index < stepIndex
                                            ? 'bg-green-500 text-white'
                                            : index === stepIndex
                                                ? 'bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-800'
                                                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                                        }
                  `}
                                >
                                    {index < stepIndex ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`
                  mt-2 text-xs font-medium hidden sm:block
                  ${index <= stepIndex ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}
                `}>
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`
                  w-12 sm:w-20 h-1 mx-2 rounded-full
                  ${index < stepIndex ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'}
                `} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-lg">
                {currentStep === 'select' && (
                    <DatabaseTypeSelector
                        selectedType={selectedType}
                        onSelectType={handleTypeSelect}
                    />
                )}

                {currentStep === 'configure' && selectedType && (
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                Configure {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                Enter your database connection details
                            </p>
                        </div>
                        <ConnectionFormFields
                            type={selectedType}
                            config={config}
                            onChange={handleConfigChange}
                        />
                    </div>
                )}

                {currentStep === 'test' && (
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                Test Connection
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                Verifying your database connection
                            </p>
                        </div>
                        <ConnectionTestResult
                            status={connectionStatus}
                            message={connectionMessage}
                            tables={tables}
                            onRetry={handleTestConnection}
                        />
                    </div>
                )}

                {currentStep === 'complete' && (
                    <div className="text-center py-8">
                        <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                            <Check className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                            All Set!
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                            Your database is connected and ready to use.
                        </p>
                        <button
                            onClick={onComplete}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all hover:scale-105"
                        >
                            Start Chatting
                        </button>
                    </div>
                )}

                {/* Navigation Buttons */}
                {currentStep !== 'complete' && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                        {stepIndex > 0 ? (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                        ) : (
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                Cancel
                            </button>
                        )}

                        {currentStep === 'test' && connectionStatus === 'success' ? (
                            <button
                                onClick={handleSaveConnection}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-zinc-400 disabled:to-zinc-400 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:hover:scale-100"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Save & Continue
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-zinc-400 disabled:to-zinc-400 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {currentStep === 'configure' ? 'Test Connection' : 'Next'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
