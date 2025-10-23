import { db } from '@/db/db';
import { queryHistoryTable } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const history = await db
      .select()
      .from(queryHistoryTable)
      .orderBy(desc(queryHistoryTable.created_at))
      .limit(50);

    return NextResponse.json(history || []);
  } catch (error) {
    console.error('Failed to fetch query history:', error);
    // Return empty array instead of error for better UX
    return NextResponse.json([]);
  }
}
