import { text, integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Products table
export const productsTable = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    category: text('category').notNull(),
    price: real('price').notNull(),
    stock: integer('stock').notNull().default(0),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Sales table
export const salesTable = sqliteTable('sales', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    product_id: integer('product_id')
        .notNull()
        .references(() => productsTable.id),
    quantity: integer('quantity').notNull(),
    total_amount: real('total_amount').notNull(),
    sale_date: text('sale_date').default(sql`CURRENT_TIMESTAMP`),
    customer_name: text('customer_name').notNull(),
    region: text('region').notNull(),
});

// Query History table for audit logging and analytics
export const queryHistoryTable = sqliteTable('query_history', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().default('anonymous'),
    prompt: text('prompt').notNull(),
    sql_query: text('sql_query'),
    result_count: integer('result_count'),
    execution_time_ms: integer('execution_time_ms'),
    tokens_used: integer('tokens_used'),
    error_message: text('error_message'),
    status: text('status').notNull().default('success'), // success, error, timeout
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});