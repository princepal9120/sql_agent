'use client';

import { Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { DatabaseType, DatabaseConfig } from '@/lib/db-types';
import { getPlaceholders } from '@/lib/db-types';

interface ConnectionFormFieldsProps {
    type: DatabaseType;
    config: Partial<DatabaseConfig>;
    onChange: (config: Partial<DatabaseConfig>) => void;
    errors?: Record<string, string>;
}

interface FieldConfig {
    name: keyof DatabaseConfig;
    label: string;
    type: 'text' | 'password' | 'number' | 'checkbox';
    required?: boolean;
    tooltip?: string;
}

const fieldsByType: Record<DatabaseType, FieldConfig[]> = {
    postgresql: [
        { name: 'host', label: 'Host', type: 'text', required: true, tooltip: 'Database server hostname or IP address' },
        { name: 'port', label: 'Port', type: 'number', tooltip: 'Default: 5432' },
        { name: 'database', label: 'Database', type: 'text', required: true, tooltip: 'Name of the database to connect to' },
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'ssl', label: 'Use SSL', type: 'checkbox', tooltip: 'Enable secure connection' },
    ],
    mysql: [
        { name: 'host', label: 'Host', type: 'text', required: true, tooltip: 'Database server hostname or IP address' },
        { name: 'port', label: 'Port', type: 'number', tooltip: 'Default: 3306' },
        { name: 'database', label: 'Database', type: 'text', required: true, tooltip: 'Name of the database to connect to' },
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'password', label: 'Password', type: 'password' },
    ],
    sqlite: [
        { name: 'url', label: 'Database Path', type: 'text', required: true, tooltip: 'Path to SQLite database file (e.g., ./data.db)' },
    ],
    turso: [
        { name: 'url', label: 'Database URL', type: 'text', required: true, tooltip: 'Your Turso database URL (libsql://...)' },
        { name: 'authToken', label: 'Auth Token', type: 'password', required: true, tooltip: 'Authentication token from Turso dashboard' },
    ],
};

export function ConnectionFormFields({ type, config, onChange, errors = {} }: ConnectionFormFieldsProps) {
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
    const fields = fieldsByType[type] || [];
    const placeholders = getPlaceholders(type);

    const handleChange = (name: keyof DatabaseConfig, value: string | boolean | number) => {
        onChange({ ...config, [name]: value });
    };

    const togglePassword = (name: string) => {
        setShowPasswords(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div className="space-y-5">
            {fields.map((field) => (
                <div key={field.name}>
                    <div className="flex items-center gap-2 mb-2">
                        <label
                            htmlFor={field.name}
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.tooltip && (
                            <div className="group relative">
                                <HelpCircle className="w-4 h-4 text-zinc-400 cursor-help" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-xs rounded-lg shadow-lg z-10">
                                    {field.tooltip}
                                </div>
                            </div>
                        )}
                    </div>

                    {field.type === 'checkbox' ? (
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id={field.name}
                                    checked={Boolean(config[field.name])}
                                    onChange={(e) => handleChange(field.name, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:bg-blue-500 transition-colors" />
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                            </div>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                {field.tooltip || 'Enable'}
                            </span>
                        </label>
                    ) : field.type === 'password' ? (
                        <div className="relative">
                            <input
                                type={showPasswords[field.name] ? 'text' : 'password'}
                                id={field.name}
                                value={(config[field.name] as string) || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                placeholder={(placeholders as any)[field.name] || ''}
                                className={`
                  w-full px-4 py-3 pr-12 rounded-lg border transition-colors
                  bg-white dark:bg-zinc-800
                  ${errors[field.name]
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-zinc-300 dark:border-zinc-600 focus:border-blue-500 focus:ring-blue-500'
                                    }
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  text-zinc-900 dark:text-white placeholder-zinc-400
                `}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword(field.name)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            >
                                {showPasswords[field.name] ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    ) : (
                        <input
                            type={field.type}
                            id={field.name}
                            value={(config[field.name] as string | number) || ''}
                            onChange={(e) => handleChange(
                                field.name,
                                field.type === 'number' ? parseInt(e.target.value) || '' : e.target.value
                            )}
                            placeholder={(placeholders as any)[field.name] || ''}
                            className={`
                w-full px-4 py-3 rounded-lg border transition-colors
                bg-white dark:bg-zinc-800
                ${errors[field.name]
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-zinc-300 dark:border-zinc-600 focus:border-blue-500 focus:ring-blue-500'
                                }
                focus:outline-none focus:ring-2 focus:ring-offset-0
                text-zinc-900 dark:text-white placeholder-zinc-400
              `}
                        />
                    )}

                    {errors[field.name] && (
                        <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
