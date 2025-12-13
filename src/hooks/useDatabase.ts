'use client';

import { useState, useEffect } from 'react';

interface DatabaseInfo {
    configured: boolean;
    type?: string;
    host?: string;
    database?: string;
    url?: string;
    savedAt?: string;
}

interface UseDatabaseResult {
    isLoading: boolean;
    isConfigured: boolean;
    databaseInfo: DatabaseInfo | null;
    refresh: () => Promise<void>;
    disconnect: () => Promise<void>;
}

export function useDatabase(): UseDatabaseResult {
    const [isLoading, setIsLoading] = useState(true);
    const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null);

    const fetchDatabaseInfo = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/save-connection');
            const data = await response.json();
            setDatabaseInfo(data);
        } catch (error) {
            console.error('Failed to fetch database info:', error);
            setDatabaseInfo({ configured: false });
        } finally {
            setIsLoading(false);
        }
    };

    const disconnect = async () => {
        try {
            await fetch('/api/save-connection', { method: 'DELETE' });
            setDatabaseInfo({ configured: false });
        } catch (error) {
            console.error('Failed to disconnect database:', error);
        }
    };

    useEffect(() => {
        fetchDatabaseInfo();
    }, []);

    return {
        isLoading,
        isConfigured: databaseInfo?.configured || false,
        databaseInfo,
        refresh: fetchDatabaseInfo,
        disconnect,
    };
}
