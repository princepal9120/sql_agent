/**
 * AI Insight Generator
 * Generates natural language insights from query results
 */

export interface Insight {
  type: 'summary' | 'trend' | 'comparison' | 'anomaly' | 'recommendation';
  text: string;
  confidence: 'high' | 'medium' | 'low';
}

export function generateInsights(
  data: any[],
  columns: string[],
  query: string
): Insight[] {
  const insights: Insight[] = [];

  if (!data || data.length === 0) {
    insights.push({
      type: 'summary',
      text: 'No results found for this query.',
      confidence: 'high',
    });
    return insights;
  }

  // Summary insight
  insights.push({
    type: 'summary',
    text: `Found ${data.length} result${data.length === 1 ? '' : 's'} with ${columns.length} column${columns.length === 1 ? '' : 's'}.`,
    confidence: 'high',
  });

  // Detect numeric columns and generate statistical insights
  const numericInsights = generateNumericInsights(data, columns);
  insights.push(...numericInsights);

  // Detect trends (if data is sorted or has time dimension)
  const trendInsights = generateTrendInsights(data, columns);
  insights.push(...trendInsights);

  // Detect comparisons (if grouping detected)
  const comparisonInsights = generateComparisonInsights(data, columns);
  insights.push(...comparisonInsights);

  // Detect anomalies
  const anomalyInsights = generateAnomalyInsights(data, columns);
  insights.push(...anomalyInsights);

  return insights;
}

function generateNumericInsights(data: any[], columns: string[]): Insight[] {
  const insights: Insight[] = [];

  columns.forEach((col) => {
    const values = data
      .map((row) => row[col])
      .filter((v) => v != null && !isNaN(Number(v)))
      .map(Number);

    if (values.length < 2) return;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Check if column name suggests money/revenue
    if (/price|amount|revenue|cost|total|sales/i.test(col)) {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(sum);

      insights.push({
        type: 'summary',
        text: `Total ${col.replace(/_/g, ' ')}: ${formatted}, ranging from ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(min)} to ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(max)}.`,
        confidence: 'high',
      });
    } else if (/count|quantity|stock/i.test(col)) {
      insights.push({
        type: 'summary',
        text: `Total ${col.replace(/_/g, ' ')}: ${sum.toLocaleString()}, average: ${avg.toFixed(1)}.`,
        confidence: 'high',
      });
    }
  });

  return insights;
}

function generateTrendInsights(data: any[], columns: string[]): Insight[] {
  const insights: Insight[] = [];

  // Check if there's a date column
  const dateColumn = columns.find((col) =>
    /date|time|created|updated|year|month/i.test(col)
  );

  if (!dateColumn) return insights;

  // Find numeric columns for trend analysis
  const numericColumns = columns.filter((col) => {
    const values = data.map((row) => row[col]).filter((v) => v != null);
    return values.every((v) => !isNaN(Number(v)));
  });

  numericColumns.forEach((col) => {
    const values = data.map((row) => Number(row[col])).filter((v) => !isNaN(v));
    if (values.length < 3) return;

    // Simple trend detection: compare first half vs second half
    const midpoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midpoint);
    const secondHalf = values.slice(midpoint);

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (Math.abs(percentChange) > 5) {
      const direction = percentChange > 0 ? 'increased' : 'decreased';
      insights.push({
        type: 'trend',
        text: `${col.replace(/_/g, ' ')} ${direction} by ${Math.abs(percentChange).toFixed(1)}% over the time period.`,
        confidence: 'medium',
      });
    }
  });

  return insights;
}

function generateComparisonInsights(data: any[], columns: string[]): Insight[] {
  const insights: Insight[] = [];

  // Look for categorical columns (region, category, etc.)
  const categoricalColumn = columns.find((col) =>
    /region|category|type|name|status/i.test(col)
  );

  if (!categoricalColumn) return insights;

  // Find numeric column to compare
  const numericColumn = columns.find((col) => {
    const values = data.map((row) => row[col]).filter((v) => v != null);
    return values.every((v) => !isNaN(Number(v)));
  });

  if (!numericColumn) return insights;

  // Group by categorical and find top performer
  const groups = new Map<string, number[]>();
  data.forEach((row) => {
    const category = String(row[categoricalColumn]);
    const value = Number(row[numericColumn]);
    if (!isNaN(value)) {
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category)!.push(value);
    }
  });

  if (groups.size > 1) {
    const totals = Array.from(groups.entries()).map(([cat, vals]) => ({
      category: cat,
      total: vals.reduce((a, b) => a + b, 0),
    }));

    totals.sort((a, b) => b.total - a.total);

    if (totals.length >= 2) {
      insights.push({
        type: 'comparison',
        text: `Top ${categoricalColumn.replace(/_/g, ' ')}: "${totals[0].category}" leads with ${totals[0].total.toLocaleString()}, followed by "${totals[1].category}" at ${totals[1].total.toLocaleString()}.`,
        confidence: 'high',
      });
    }
  }

  return insights;
}

function generateAnomalyInsights(data: any[], columns: string[]): Insight[] {
  const insights: Insight[] = [];

  columns.forEach((col) => {
    const values = data
      .map((row) => row[col])
      .filter((v) => v != null && !isNaN(Number(v)))
      .map(Number);

    if (values.length < 5) return;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);

    // Find outliers (values > 2 standard deviations from mean)
    const outliers = values.filter((v) => Math.abs(v - avg) > 2 * stdDev);

    if (outliers.length > 0 && outliers.length < values.length * 0.1) {
      insights.push({
        type: 'anomaly',
        text: `${outliers.length} unusual value${outliers.length === 1 ? '' : 's'} detected in ${col.replace(/_/g, ' ')} (significantly different from average).`,
        confidence: 'medium',
      });
    }
  });

  return insights;
}

/**
 * Generate follow-up question suggestions based on results
 */
export function generateFollowUpQuestions(
  data: any[],
  columns: string[],
  originalQuery: string
): string[] {
  const questions: string[] = [];

  if (data.length === 0) {
    questions.push('Can you show me all available tables?');
    questions.push('What columns are in the products table?');
    return questions;
  }

  // Check for time dimension
  const hasDate = columns.some((col) => /date|time|created|year|month/i.test(col));
  if (hasDate) {
    questions.push('How does this trend look over the last 6 months?');
    questions.push('Can you compare this year vs last year?');
  }

  // Check for categorical data
  const hasCategorical = columns.some((col) => 
    /region|category|type|name|status/i.test(col)
  );
  if (hasCategorical) {
    questions.push('Can you break this down by category?');
    questions.push('Which region performs best?');
  }

  // Check for aggregatable data
  const hasNumeric = columns.some((col) => 
    /price|amount|revenue|quantity|total/i.test(col)
  );
  if (hasNumeric) {
    questions.push('What is the average and total?');
    questions.push('Show me the top 5 results');
  }

  // Generic questions
  questions.push('Can you visualize this data?');
  questions.push('What insights can you find?');

  return questions.slice(0, 4); // Return max 4 suggestions
}
