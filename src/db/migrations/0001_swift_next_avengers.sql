CREATE TABLE `query_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text DEFAULT 'anonymous' NOT NULL,
	`prompt` text NOT NULL,
	`sql_query` text,
	`result_count` integer,
	`execution_time_ms` integer,
	`tokens_used` integer,
	`error_message` text,
	`status` text DEFAULT 'success' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
