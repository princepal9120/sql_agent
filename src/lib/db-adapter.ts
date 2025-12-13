// Server-only database connection code
// This file can only be imported in API routes and server components

import 'server-only';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleMySQL } from 'drizzle-orm/mysql2';
import { drizzle as drizzleLibSQL } from 'drizzle-orm/libsql';
import { createClient as createLibSQLClient } from '@libsql/client';
import { Pool as PgPool } from 'pg';
import mysql from 'mysql2/promise';

import { DatabaseConfig, ConnectionResult, validateConfig } from './db-types';

export { type DatabaseConfig, type ConnectionResult, validateConfig } from './db-types';

// Create database connection based on type
export async function createDatabaseConnection(config: DatabaseConfig) {
    const validation = validateConfig(config);
    if (!validation.valid) {
        throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    switch (config.type) {
        case 'postgresql': {
            const pool = new PgPool({
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
            const connection = await mysql.createPool({
                host: config.host,
                port: config.port || 3306,
                database: config.database,
                user: config.username,
                password: config.password,
            });
            return drizzleMySQL(connection);
        }

        case 'sqlite':
        case 'turso': {
            const client = createLibSQLClient({
                url: config.url || `file:${config.database}`,
                authToken: config.authToken,
            });
            return drizzleLibSQL(client);
        }

        default:
            throw new Error(`Unsupported database type: ${config.type}`);
    }
}

// Test database connection without storing
export async function testDatabaseConnection(config: DatabaseConfig): Promise<ConnectionResult> {
    try {
        const validation = validateConfig(config);
        if (!validation.valid) {
            return {
                success: false,
                message: 'Invalid configuration',
                error: validation.errors.join(', '),
            };
        }

        switch (config.type) {
            case 'postgresql': {
                const pool = new PgPool({
                    host: config.host,
                    port: config.port || 5432,
                    database: config.database,
                    user: config.username,
                    password: config.password,
                    ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
                    connectionTimeoutMillis: 5000,
                });

                const client = await pool.connect();
                const result = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          LIMIT 20
        `);
                const tables = result.rows.map(r => r.table_name);
                client.release();
                await pool.end();

                return {
                    success: true,
                    message: `Connected successfully! Found ${tables.length} tables.`,
                    tables,
                };
            }

            case 'mysql': {
                const connection = await mysql.createConnection({
                    host: config.host,
                    port: config.port || 3306,
                    database: config.database,
                    user: config.username,
                    password: config.password,
                    connectTimeout: 5000,
                });

                const [rows] = await connection.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = ?
          LIMIT 20
        `, [config.database]);
                const tables = (rows as any[]).map(r => r.TABLE_NAME || r.table_name);
                await connection.end();

                return {
                    success: true,
                    message: `Connected successfully! Found ${tables.length} tables.`,
                    tables,
                };
            }

            case 'sqlite':
            case 'turso': {
                const client = createLibSQLClient({
                    url: config.url || `file:${config.database}`,
                    authToken: config.authToken,
                });

                const result = await client.execute(`
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name NOT LIKE 'sqlite_%'
          LIMIT 20
        `);
                const tables = result.rows.map(r => r.name as string);

                return {
                    success: true,
                    message: `Connected successfully! Found ${tables.length} tables.`,
                    tables,
                };
            }

            default:
                return {
                    success: false,
                    message: 'Unsupported database type',
                    error: `Type "${config.type}" is not supported`,
                };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Provide helpful error messages
        let helpMessage = '';
        if (errorMessage.includes('ECONNREFUSED')) {
            helpMessage = 'Connection refused. Check if the database server is running and the host/port are correct.';
        } else if (errorMessage.includes('authentication failed') || errorMessage.includes('Access denied')) {
            helpMessage = 'Authentication failed. Check your username and password.';
        } else if (errorMessage.includes('does not exist') || errorMessage.includes('Unknown database')) {
            helpMessage = 'Database not found. Check if the database name is correct.';
        } else if (errorMessage.includes('timeout')) {
            helpMessage = 'Connection timed out. The server might be unreachable or behind a firewall.';
        } else if (errorMessage.includes('URL_INVALID')) {
            helpMessage = 'Invalid URL format. Make sure to use the correct format for your database type.';
        }

        return {
            success: false,
            message: 'Connection failed',
            error: helpMessage || errorMessage,
        };
    }
}
