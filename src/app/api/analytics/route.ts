import { db } from '@/db/db';
import { queryHistoryTable } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get analytics metrics with proper null handling
    const totalQueriesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(queryHistoryTable);
    const totalQueries = totalQueriesResult[0]?.count || 0;

    const successQueriesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(queryHistoryTable)
      .where(sql`${queryHistoryTable.status} = 'success'`);
    const successQueries = successQueriesResult[0]?.count || 0;

    const avgExecutionTimeResult = await db
      .select({ 
        avg: sql<number>`AVG(${queryHistoryTable.execution_time_ms})` 
      })
      .from(queryHistoryTable)
      .where(sql`${queryHistoryTable.status} = 'success'`);
    const avgExecutionTime = avgExecutionTimeResult[0]?.avg || 0;

    const totalRowsReturnedResult = await db
      .select({ 
        sum: sql<number>`SUM(${queryHistoryTable.result_count})` 
      })
      .from(queryHistoryTable)
      .where(sql`${queryHistoryTable.status} = 'success'`);
    const totalRowsReturned = totalRowsReturnedResult[0]?.sum || 0;

    // Get error breakdown
    const errorStats = await db
      .select({
        error: queryHistoryTable.error_message,
        count: sql<number>`count(*)`,
      })
      .from(queryHistoryTable)
      .where(sql`${queryHistoryTable.status} = 'error'`)
      .groupBy(queryHistoryTable.error_message)
      .limit(10);

    // Get queries over time (last 24 hours)
    const queriesOverTime = await db
      .select({
        hour: sql<string>`strftime('%Y-%m-%d %H:00:00', ${queryHistoryTable.created_at})`,
        count: sql<number>`count(*)`,
      })
      .from(queryHistoryTable)
      .groupBy(sql`strftime('%Y-%m-%d %H:00:00', ${queryHistoryTable.created_at})`)
      .orderBy(sql`strftime('%Y-%m-%d %H:00:00', ${queryHistoryTable.created_at})`)
      .limit(24);

    const analytics = {
      totalQueries,
      successfulQueries: successQueries,
      errorRate:
        totalQueries > 0
          ? ((totalQueries - successQueries) / totalQueries) * 100
          : 0,
      avgExecutionTime: Math.round(avgExecutionTime),
      totalRowsReturned,
      errorBreakdown: errorStats,
      queriesOverTime,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
