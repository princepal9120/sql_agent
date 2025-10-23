/**
 * Chart recommendation engine
 * Analyzes query results to suggest the best chart type
 */

export interface ChartRecommendation {
  type: 'bar' | 'line' | 'pie' | 'area' | 'table';
  reason: string;
  xAxis?: string;
  yAxis?: string;
}

export function recommendChartType(
  data: any[],
  columns: string[]
): ChartRecommendation {
  if (!data || data.length === 0) {
    return {
      type: 'table',
      reason: 'No data to visualize',
    };
  }

  // Get column types
  const columnTypes = analyzeColumnTypes(data, columns);
  const numericColumns = columnTypes.filter((c) => c.type === 'numeric');
  const categoricalColumns = columnTypes.filter((c) => c.type === 'categorical');
  const dateColumns = columnTypes.filter((c) => c.type === 'date');

  // Case 1: Time series data (date + numeric)
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    return {
      type: 'line',
      reason: 'Time series data detected - line chart shows trends over time',
      xAxis: dateColumns[0].name,
      yAxis: numericColumns[0].name,
    };
  }

  // Case 2: Single categorical + numeric (good for bar/pie)
  if (categoricalColumns.length === 1 && numericColumns.length >= 1) {
    // Use pie chart if data count is small (< 8) and represents parts of a whole
    if (data.length <= 7) {
      return {
        type: 'pie',
        reason: 'Small categorical dataset - pie chart shows proportions',
        xAxis: categoricalColumns[0].name,
        yAxis: numericColumns[0].name,
      };
    }
    return {
      type: 'bar',
      reason: 'Categorical data - bar chart compares values across categories',
      xAxis: categoricalColumns[0].name,
      yAxis: numericColumns[0].name,
    };
  }

  // Case 3: Multiple numeric columns (comparison)
  if (numericColumns.length >= 2) {
    return {
      type: 'bar',
      reason: 'Multiple numeric values - bar chart compares metrics',
      xAxis: columns[0],
      yAxis: numericColumns[0].name,
    };
  }

  // Case 4: Aggregated data with count/sum (use bar)
  const hasAggregation = columns.some((col) =>
    /count|sum|avg|total|max|min/i.test(col)
  );
  if (hasAggregation && categoricalColumns.length > 0) {
    return {
      type: 'bar',
      reason: 'Aggregated data - bar chart shows computed values by category',
      xAxis: categoricalColumns[0].name,
      yAxis: numericColumns[0]?.name || columns[1],
    };
  }

  // Case 5: Large dataset (> 20 rows) with numeric - use area for trends
  if (data.length > 20 && numericColumns.length > 0) {
    return {
      type: 'area',
      reason: 'Large dataset - area chart shows overall trends',
      xAxis: columns[0],
      yAxis: numericColumns[0].name,
    };
  }

  // Default to table for complex data
  return {
    type: 'table',
    reason: 'Complex data structure - table view provides detailed information',
  };
}

interface ColumnTypeInfo {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'boolean' | 'unknown';
}

function analyzeColumnTypes(data: any[], columns: string[]): ColumnTypeInfo[] {
  return columns.map((col) => {
    const values = data.map((row) => row[col]).filter((v) => v != null);
    
    if (values.length === 0) {
      return { name: col, type: 'unknown' };
    }

    // Check if numeric
    const numericValues = values.filter((v) => typeof v === 'number' || !isNaN(Number(v)));
    if (numericValues.length / values.length > 0.8) {
      return { name: col, type: 'numeric' };
    }

    // Check if date
    const datePatterns = /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|^\d{13}$/;
    const dateValues = values.filter((v) => {
      if (typeof v === 'string' && datePatterns.test(v)) return true;
      if (typeof v === 'number' && v > 1000000000 && v < 9999999999999) return true; // Unix timestamp
      return false;
    });
    if (dateValues.length / values.length > 0.8) {
      return { name: col, type: 'date' };
    }

    // Check if boolean
    const boolValues = values.filter((v) => 
      v === true || v === false || v === 0 || v === 1 || 
      (typeof v === 'string' && /^(true|false|yes|no)$/i.test(v))
    );
    if (boolValues.length / values.length > 0.8) {
      return { name: col, type: 'boolean' };
    }

    // Default to categorical
    return { name: col, type: 'categorical' };
  });
}
