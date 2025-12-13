'use client';

import { Database } from 'lucide-react';
import type { DatabaseType } from '@/lib/db-types';

interface DatabaseTypeCardProps {
    type: DatabaseType;
    name: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
}

const databaseIcons: Record<DatabaseType, string> = {
    postgresql: '🐘',
    mysql: '🐬',
    sqlite: '📦',
    turso: '🚀',
};

const databaseColors: Record<DatabaseType, { bg: string; border: string; text: string }> = {
    postgresql: {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
    },
    mysql: {
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-500',
        text: 'text-orange-600 dark:text-orange-400',
    },
    sqlite: {
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-500',
        text: 'text-green-600 dark:text-green-400',
    },
    turso: {
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-500',
        text: 'text-purple-600 dark:text-purple-400',
    },
};

export function DatabaseTypeCard({ type, name, description, selected, onSelect }: DatabaseTypeCardProps) {
    const colors = databaseColors[type];
    const icon = databaseIcons[type];

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`
        relative w-full p-6 rounded-xl border-2 transition-all duration-200
        text-left group hover:scale-[1.02] hover:shadow-lg
        ${selected
                    ? `${colors.bg} ${colors.border} shadow-md`
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }
      `}
        >
            {selected && (
                <div className="absolute top-3 right-3">
                    <div className={`w-6 h-6 rounded-full ${colors.border.replace('border-', 'bg-')} flex items-center justify-center`}>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-4">
                <div className={`text-4xl ${selected ? '' : 'grayscale group-hover:grayscale-0'} transition-all`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-1 ${selected ? colors.text : 'text-zinc-900 dark:text-white'}`}>
                        {name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {description}
                    </p>
                </div>
            </div>
        </button>
    );
}

interface DatabaseTypeSelectorProps {
    selectedType: DatabaseType | null;
    onSelectType: (type: DatabaseType) => void;
}

const databases: { type: DatabaseType; name: string; description: string }[] = [
    {
        type: 'postgresql',
        name: 'PostgreSQL',
        description: 'Powerful open-source relational database',
    },
    {
        type: 'mysql',
        name: 'MySQL',
        description: 'Popular open-source relational database',
    },
    {
        type: 'sqlite',
        name: 'SQLite',
        description: 'Lightweight file-based database',
    },
    {
        type: 'turso',
        name: 'Turso',
        description: 'Edge-hosted SQLite with LibSQL',
    },
];

export function DatabaseTypeSelector({ selectedType, onSelectType }: DatabaseTypeSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
                    <Database className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    Choose your database
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Select the type of database you want to connect
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {databases.map((db) => (
                    <DatabaseTypeCard
                        key={db.type}
                        type={db.type}
                        name={db.name}
                        description={db.description}
                        selected={selectedType === db.type}
                        onSelect={() => onSelectType(db.type)}
                    />
                ))}
            </div>
        </div>
    );
}
