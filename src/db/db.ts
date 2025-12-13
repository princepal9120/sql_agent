import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { drizzle as drizzleMySQL } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Helper to create connection based on config or env
function createDbConnection() {
    // 1. Check for saved configuration
    const configPath = join(process.cwd(), '.config/database.json');

    if (existsSync(configPath)) {
        try {
            const config = JSON.parse(readFileSync(configPath, 'utf-8'));

            switch (config.type) {
                case 'postgresql': {
                    const pool = new Pool({
                        host: config.host,
                        port: config.port || 5432,
                        database: config.database,
                        user: config.username,
                        password: config.password,
                        ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
                    });
                    return drizzlePg(pool);
                }
                case 'mysql': {
                    const pool = mysql.createPool({
                        host: config.host,
                        port: config.port || 3306,
                        database: config.database,
                        user: config.username,
                        password: config.password,
                    });
                    return drizzleMySQL(pool);
                }
                case 'sqlite':
                case 'turso': {
                    const client = createClient({
                        url: config.url || `file:${config.database}`,
                        authToken: config.authToken,
                    });
                    return drizzle(client);
                }
            }
        } catch (error) {
            console.error('Failed to load database config:', error);
        }
    }

    // 2. Fallback to Environment Variables (Default Turso/LibSQL)
    // Only if TURSO_DATABASE_URL is set
    if (process.env.TURSO_DATABASE_URL) {
        const turso = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });
        return drizzle(turso);
    }

    // 3. Fallback for build time / no config
    // Return a dummy client to prevent build errors if env is missing
    const dummy = createClient({
        url: 'file::memory:',
    });
    return drizzle(dummy);
}

// Export the database instance
// Cast to any to allow different driver types interchangeably in the app
export const db = createDbConnection() as any;