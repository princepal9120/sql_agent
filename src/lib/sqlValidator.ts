import { Parser } from 'node-sql-parser';

const parser = new Parser();

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedQuery?: string;
}

const FORBIDDEN_KEYWORDS = [
  'DROP',
  'DELETE',
  'TRUNCATE',
  'INSERT',
  'UPDATE',
  'ALTER',
  'CREATE',
  'REPLACE',
  'GRANT',
  'REVOKE',
  'EXEC',
  'EXECUTE',
];

/**
 * Validates and sanitizes SQL queries using AST parsing
 * Only allows SELECT queries and prevents dangerous operations
 */
export function validateAndSanitizeSQL(query: string): ValidationResult {
  try {
    // Trim and normalize the query
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      return {
        isValid: false,
        error: 'Query cannot be empty',
      };
    }

    // Check for forbidden keywords (case-insensitive)
    const upperQuery = trimmedQuery.toUpperCase();
    for (const keyword of FORBIDDEN_KEYWORDS) {
      if (upperQuery.includes(keyword)) {
        return {
          isValid: false,
          error: `Forbidden operation detected: ${keyword}. Only SELECT queries are allowed.`,
        };
      }
    }

    // Parse the SQL using AST parser
    const ast = parser.astify(trimmedQuery, { database: 'sqlite' });
    
    // Ensure it's a SELECT query
    if (Array.isArray(ast)) {
      // Multiple statements - check all are SELECT
      for (const statement of ast) {
        if (statement.type !== 'select') {
          return {
            isValid: false,
            error: 'Only SELECT queries are allowed',
          };
        }
      }
    } else if (ast.type !== 'select') {
      return {
        isValid: false,
        error: 'Only SELECT queries are allowed',
      };
    }

    // Reconstruct the query from AST to sanitize it
    const sanitizedQuery = parser.sqlify(ast, { database: 'sqlite' });

    return {
      isValid: true,
      sanitizedQuery: sanitizedQuery,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `SQL parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Explains why a SQL query was generated
 */
export function generateSQLExplanation(query: string): string {
  try {
    const ast = parser.astify(query, { database: 'sqlite' });
    const statement = Array.isArray(ast) ? ast[0] : ast;

    if (statement.type !== 'select') {
      return 'This query performs a non-SELECT operation.';
    }

    const parts: string[] = [];

    // Columns
    if (statement.columns === '*') {
      parts.push('Selecting all columns');
    } else if (Array.isArray(statement.columns)) {
      const columnNames = statement.columns.map((col: any) => {
        if (col.expr?.column === '*') return 'all columns';
        if (col.expr?.type === 'aggr_func') {
          return `${col.expr.name}(${col.expr.args?.expr?.column || '*'})${col.as ? ` as ${col.as}` : ''}`;
        }
        return col.as || col.expr?.column || 'unknown';
      });
      parts.push(`Selecting: ${columnNames.join(', ')}`);
    }

    // FROM clause
    if (statement.from) {
      const tables = Array.isArray(statement.from) ? statement.from : [statement.from];
      const tableNames = tables.map((t: any) => t.table || t.as || 'unknown');
      parts.push(`from ${tableNames.join(', ')}`);
    }

    // WHERE clause
    if (statement.where) {
      parts.push('with filtering conditions');
    }

    // GROUP BY
    if (statement.groupby) {
      parts.push('grouped by specific columns');
    }

    // ORDER BY
    if (statement.orderby) {
      parts.push('sorted by specific columns');
    }

    // LIMIT
    if (statement.limit) {
      const limitValue = statement.limit.value?.[0]?.value || statement.limit.value || 'unknown';
      parts.push(`limited to ${limitValue} rows`);
    }

    return parts.join(', ') + '.';
  } catch (error) {
    return 'Unable to parse query explanation.';
  }
}

/**
 * Suggests a correction if SQL query has errors
 */
export function suggestSQLCorrection(query: string, error: string): string {
  const suggestions: string[] = [];

  // Common error patterns
  if (error.toLowerCase().includes('syntax error')) {
    suggestions.push('Check for missing commas, parentheses, or quotes');
  }

  if (error.toLowerCase().includes('no such table')) {
    suggestions.push('Verify the table name exists in the schema');
    suggestions.push('Use the schema tool to see available tables');
  }

  if (error.toLowerCase().includes('no such column')) {
    suggestions.push('Check if the column name is spelled correctly');
    suggestions.push('Use the schema tool to see available columns');
  }

  if (error.toLowerCase().includes('ambiguous')) {
    suggestions.push('Use table aliases to disambiguate column names (e.g., t1.id, t2.id)');
  }

  if (query.toLowerCase().includes('join') && !query.toLowerCase().includes('on')) {
    suggestions.push('Add an ON clause to your JOIN statement');
  }

  // Generic suggestions
  if (suggestions.length === 0) {
    suggestions.push('Review the SQL syntax');
    suggestions.push('Check table and column names against the schema');
    suggestions.push('Ensure proper use of quotes for string literals');
  }

  return suggestions.join('. ') + '.';
}
