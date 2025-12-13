// Client-safe utility types and functions
// These can be imported in both client and server components

export type DatabaseType = 'postgresql' | 'mysql' | 'sqlite' | 'turso';

export interface DatabaseConfig {
    type: DatabaseType;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    url?: string;
    authToken?: string;
    ssl?: boolean;
}

export interface ConnectionResult {
    success: boolean;
    message: string;
    tables?: string[];
    error?: string;
}

// Validate configuration based on database type
export function validateConfig(config: DatabaseConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.type) {
        errors.push('Database type is required');
        return { valid: false, errors };
    }

    switch (config.type) {
        case 'postgresql':
        case 'mysql':
            if (!config.host) errors.push('Host is required');
            if (!config.database) errors.push('Database name is required');
            if (!config.username) errors.push('Username is required');
            break;
        case 'sqlite':
            if (!config.url && !config.database) errors.push('Database file path is required');
            break;
        case 'turso':
            if (!config.url) errors.push('Database URL is required');
            break;
    }

    return { valid: errors.length === 0, errors };
}

// Get default port for database type
export function getDefaultPort(type: DatabaseType): number {
    switch (type) {
        case 'postgresql': return 5432;
        case 'mysql': return 3306;
        default: return 0;
    }
}

// Get placeholder values for database type
export function getPlaceholders(type: DatabaseType) {
    switch (type) {
        case 'postgresql':
            return {
                host: 'localhost',
                port: '5432',
                database: 'my_database',
                username: 'postgres',
            };
        case 'mysql':
            return {
                host: 'localhost',
                port: '3306',
                database: 'my_database',
                username: 'root',
            };
        case 'sqlite':
            return {
                url: './database.db',
            };
        case 'turso':
            return {
                url: 'libsql://your-database.turso.io',
                authToken: 'your-auth-token',
            };
    }
}
