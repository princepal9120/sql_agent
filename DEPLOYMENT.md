# 🚀 AI Data Insights Platform - Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Turso database account (or local SQLite for development)
- OpenAI API key
- Vercel account (for deployment)

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Turso Database (Production)
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Or use local SQLite for development
# TURSO_DATABASE_URL=file:./local.db

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key
```

### 3. Database Migration

Run the database migrations to create all necessary tables:

```bash
pnpm db:migrate
```

### 4. Seed Database (Optional)

If you have a seed script, populate the database:

```bash
pnpm tsx src/db/db.seed.ts
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deploying to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Add Environment Variables**

   ```bash
   vercel env add TURSO_DATABASE_URL
   vercel env add TURSO_AUTH_TOKEN
   vercel env add OPENAI_API_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `OPENAI_API_KEY`
5. Click "Deploy"

## 🗄️ Setting Up Turso Database

### 1. Install Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 2. Sign Up / Login

```bash
turso auth signup
# or
turso auth login
```

### 3. Create Database

```bash
turso db create sql-agent-db
```

### 4. Get Connection Details

```bash
turso db show sql-agent-db
```

Copy the URL to `TURSO_DATABASE_URL` in your `.env.local`

### 5. Create Auth Token

```bash
turso db tokens create sql-agent-db
```

Copy the token to `TURSO_AUTH_TOKEN` in your `.env.local`

### 6. Run Migrations

```bash
pnpm db:migrate
```

## 🔧 Configuration Options

### Tailwind CSS

Tailwind is pre-configured with dark mode support. Customize colors in `tailwind.config.ts`.

### AI Model

Change the AI model in `src/app/api/chat/route.ts`:

```typescript
model: openai("gpt-4-turbo"); // or 'gpt-3.5-turbo' for faster/cheaper queries
```

### Query Limits

Adjust pagination and limits in:

- `src/components/DataTable.tsx` - Table page size
- `src/app/api/history/route.ts` - History query limit

## 📊 Database Studio

View and edit your database with Drizzle Studio:

```bash
pnpm db:studio
```

Opens at [http://localhost:4983](http://localhost:4983)

## 🧪 Testing the Platform

### Test Queries to Try:

1. "Show me all products"
2. "What are the top 5 products by revenue?"
3. "Analyze sales trends by region"
4. "Which product category has the highest stock?"
5. "Show me total sales by month"

## 🔍 Monitoring & Analytics

Access analytics endpoint:

```
GET /api/analytics
```

Returns:

- Total queries executed
- Success/error rates
- Average execution time
- Query patterns over time

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
turso db shell sql-agent-db
```

### Migration Errors

```bash
# Generate new migration
pnpm db:generate

# Apply migrations
pnpm db:migrate
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 🎯 Performance Tips

1. **Enable Edge Runtime** (optional):
   Add to API routes for faster global response:

   ```typescript
   export const runtime = "edge";
   ```

2. **Use Response Caching**:
   Cache frequent queries in the API routes

3. **Optimize Images**:
   Use Next.js Image component for any images

4. **Database Indexing**:
   Add indexes to frequently queried columns

## 🔐 Security Considerations

1. **API Key Protection**: Never commit `.env.local` to git
2. **SQL Injection**: All queries validated by `node-sql-parser`
3. **Rate Limiting**: Consider adding rate limits to API routes
4. **CORS**: Configure allowed origins in production

## 📦 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Main AI chat endpoint
│   │   ├── history/route.ts     # Query history API
│   │   └── analytics/route.ts   # Analytics API
│   ├── page.tsx                 # Main dashboard
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── ChatPanel.tsx            # Chat interface
│   ├── SQLPreview.tsx           # SQL display
│   ├── DataTable.tsx            # Results table
│   ├── ChartView.tsx            # Visualizations
│   ├── InsightSummary.tsx       # AI insights
│   ├── QueryHistory.tsx         # History sidebar
│   └── ThemeSwitcher.tsx        # Dark mode toggle
├── db/
│   ├── schema.ts                # Database schema
│   ├── db.ts                    # Database client
│   └── migrations/              # SQL migrations
└── lib/
    ├── sqlValidator.ts          # SQL security
    ├── chartRecommender.ts      # Chart selection AI
    └── insightGenerator.ts      # Insight generation
```

## 🚢 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Database seeded with sample data
- [ ] OpenAI API key with sufficient credits
- [ ] Vercel project created and linked
- [ ] Custom domain configured (optional)
- [ ] Analytics tracking setup (optional)
- [ ] Error monitoring configured (Sentry, etc.)

## 🎉 Success!

Your AI Data Insights Platform should now be live!

**Demo URL**: https://your-project.vercel.app

For questions or issues, check the GitHub repository or open an issue.
