
# 🎯 Quick Reference Guide

## 🚀 Common Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:3000)
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint

# Database
pnpm db:generate            # Generate migrations from schema changes
pnpm db:migrate             # Apply migrations to database
pnpm db:studio              # Open Drizzle Studio (http://localhost:4983)
pnpm tsx src/db/db.seed.ts  # Seed database with sample data

# Deployment
vercel                      # Deploy to preview
vercel --prod               # Deploy to production
```

## 📁 Key Files to Know

| File                          | Purpose                                                   |
| ----------------------------- | --------------------------------------------------------- |
| `src/app/api/chat/route.ts`   | Main AI endpoint - handles chat, SQL generation, insights |
| `src/app/page.tsx`            | Main dashboard component                                  |
| `src/db/schema.ts`            | Database schema definition                                |
| `src/lib/sqlValidator.ts`     | SQL security & validation logic                           |
| `src/lib/chartRecommender.ts` | AI chart type selection                                   |
| `src/lib/insightGenerator.ts` | AI insight generation                                     |
| `.env.local`                  | Environment variables (create this!)                      |

## 🔑 Environment Variables

```env
# Required
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
OPENAI_API_KEY=sk-your-key

# Optional (for development)
# TURSO_DATABASE_URL=file:./local.db  # Use local SQLite
```

## 🗄️ Database Schema

### Tables

```sql
products (id, name, category, price, stock, created_at)
sales (id, product_id, quantity, total_amount, sale_date, customer_name, region)
query_history (id, user_id, prompt, sql_query, result_count, execution_time_ms, tokens_used, error_message, status, created_at)
```

## 🎨 Customization Guide

### Change AI Model

**File**: `src/app/api/chat/route.ts`

```typescript
model: openai("gpt-4-turbo"); // Options: gpt-4-turbo, gpt-3.5-turbo, gpt-5-nano-2025-08-07
```

### Adjust Table Pagination

**File**: `src/components/DataTable.tsx`

```typescript
pageSize={10}  // Change default page size
```

### Modify Query History Limit

**File**: `src/app/api/history/route.ts`

```typescript
.limit(50)  // Change number of queries shown
```

### Add New Tables to Schema

**File**: `src/db/schema.ts`

```typescript
export const newTable = sqliteTable("new_table", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // ... add columns
});
```

Then run: `pnpm db:generate && pnpm db:migrate`

## 🎯 API Endpoints

### POST /api/chat

Send chat messages and execute queries

```json
{
  "messages": [{ "role": "user", "content": "Show total sales" }]
}
```

### GET /api/history

Retrieve query history (last 50 queries)

```json
[
  {
    "id": 1,
    "prompt": "Show all products",
    "sql_query": "SELECT * FROM products",
    "result_count": 25,
    "execution_time_ms": 45,
    "status": "success",
    "created_at": "2025-10-23T10:30:00Z"
  }
]
```

### GET /api/analytics

Get query analytics and metrics

```json
{
  "totalQueries": 150,
  "successfulQueries": 142,
  "errorRate": 5.33,
  "avgExecutionTime": 67,
  "totalRowsReturned": 3521
}
```

## 🔍 Troubleshooting

### "Database connection failed"

```bash
# Check database URL and auth token
turso db show your-db-name
turso db tokens create your-db-name

# Test connection
turso db shell your-db-name
```

### "OpenAI API error"

```bash
# Verify API key
echo $OPENAI_API_KEY

# Check rate limits at platform.openai.com
# Ensure billing is set up
```

### "Migration errors"

```bash
# Reset migrations (development only!)
rm -rf src/db/migrations/*
pnpm db:generate
pnpm db:migrate
```

### "Build fails"

```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### "Chart not rendering"

- Check that data array is not empty
- Verify column names match data keys
- Check browser console for errors

## 📊 Sample Queries for Testing

### Basic Queries

- "Show me all products"
- "List all sales"
- "Count total products"

### Aggregations

- "What are the top 5 products by revenue?"
- "Show total sales by region"
- "Average product price by category"

### Filtering

- "Products with stock below 10"
- "Sales in the North region"
- "Products priced above $100"

### Trends

- "Analyze sales over time"
- "Show monthly revenue trends"
- "Compare this month vs last month"

### Complex

- "Which region has the highest sales for Electronics?"
- "Show me products that haven't sold in the last 30 days"
- "Compare average order value by region"

## 🎨 Theme Customization

### Colors

Edit `tailwind.config.ts` to change color scheme:

```typescript
colors: {
  primary: '#3b82f6',  // Change primary blue
  // Add custom colors
}
```

### Fonts

Update in `src/app/layout.tsx`:

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
```

## 🚀 Performance Tips

1. **Enable Edge Runtime** (optional):

   ```typescript
   export const runtime = "edge";
   ```

2. **Add Database Indexes**:

   ```typescript
   // In schema.ts
   index("idx_product_category").on(productsTable.category);
   ```

3. **Cache Frequent Queries**:
   Use Next.js caching in API routes

4. **Optimize Charts**:
   Limit data points for large datasets

## 📦 Dependencies

### Core

- `next@15.5.6` - React framework
- `react@19.1.0` - UI library
- `typescript@5` - Type safety

### AI & Data

- `ai@5.0.76` - Vercel AI SDK
- `@ai-sdk/openai@2.0.53` - OpenAI integration
- `drizzle-orm@0.44.6` - ORM

### UI Components

- `recharts@3.3.0` - Charts
- `lucide-react@0.546.0` - Icons
- `date-fns@4.1.0` - Date formatting

### Security

- `node-sql-parser@5.3.13` - SQL validation

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Getting Help

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
2. Check [README.md](./README.md) for general info
3. Search existing GitHub issues
4. Open a new issue with:
   - Clear description
   - Steps to reproduce
   - Error messages
   - Environment (Node version, OS, etc.)

---

💡 **Pro Tip**: Use `pnpm db:studio` to visually inspect your database while developing!
