import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/db-adapter';
import { validateConfig, type DatabaseConfig } from '@/lib/db-types';
import { writeFileSync, readFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

function getConfigPath() {
    const configDir = join(process.cwd(), '.config');
    const configFile = join(configDir, 'database.json');
    return { configDir, configFile };
}

export async function POST(request: NextRequest) {
    try {
        const config: DatabaseConfig = await request.json();

        // Validate the configuration first
        const validation = validateConfig(config);
        if (!validation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid configuration',
                    errors: validation.errors,
                },
                { status: 400 }
            );
        }

        // Test the connection before saving
        const testResult = await testDatabaseConnection(config);
        if (!testResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Connection test failed',
                    error: testResult.error,
                },
                { status: 400 }
            );
        }

        const { configDir, configFile } = getConfigPath();

        // Ensure config directory exists
        if (!existsSync(configDir)) {
            mkdirSync(configDir, { recursive: true });
        }

        // Save the configuration (without sensitive data in plain text in production)
        const configToSave = {
            type: config.type,
            host: config.host,
            port: config.port,
            database: config.database,
            username: config.username,
            // In a real app, encrypt the password
            password: config.password,
            url: config.url,
            authToken: config.authToken,
            ssl: config.ssl,
            savedAt: new Date().toISOString(),
        };

        writeFileSync(configFile, JSON.stringify(configToSave, null, 2));

        return NextResponse.json({
            success: true,
            message: 'Database configuration saved successfully',
            tables: testResult.tables,
        });
    } catch (error) {
        console.error('Save connection error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { configFile } = getConfigPath();

        if (!existsSync(configFile)) {
            return NextResponse.json({
                configured: false,
                message: 'No database configured',
            });
        }

        const configData = JSON.parse(readFileSync(configFile, 'utf-8'));

        // Return config without sensitive data
        return NextResponse.json({
            configured: true,
            type: configData.type,
            host: configData.host,
            port: configData.port,
            database: configData.database,
            username: configData.username,
            url: configData.url ? configData.url.replace(/\/\/.*@/, '//***@') : undefined,
            savedAt: configData.savedAt,
        });
    } catch (error) {
        return NextResponse.json({
            configured: false,
            message: 'Error reading configuration',
        });
    }
}

export async function DELETE() {
    try {
        const { configFile } = getConfigPath();

        if (existsSync(configFile)) {
            unlinkSync(configFile);
        }

        return NextResponse.json({
            success: true,
            message: 'Database configuration removed',
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Error removing configuration',
            },
            { status: 500 }
        );
    }
}
