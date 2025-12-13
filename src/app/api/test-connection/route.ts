import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/db-adapter';
import { validateConfig, type DatabaseConfig } from '@/lib/db-types';

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

        // Test the connection
        const result = await testDatabaseConnection(config);

        return NextResponse.json(result, {
            status: result.success ? 200 : 400,
        });
    } catch (error) {
        console.error('Test connection error:', error);
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
