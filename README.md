# 🤖 AI-Powered Data Insights Platform

Transform your database queries into insights with natural language! This full-stack application combines Next.js, AI, and smart data visualization to help you understand your data better.

![AI Data Insights Platform](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-5.0-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green?logo=openai)

## ✨ Key Features

### 🧠 AI-Powered Query Generation

- **Natural Language to SQL**: Ask questions in plain English, get optimized SQL
- **Multi-step Reasoning**: AI breaks down complex queries automatically
- **SQL Explanation**: Understand why each query was generated
- **Smart Error Debugging**: AI suggests corrections when queries fail
- **Query Validation**: AST-based SQL sanitization prevents injection attacks

### 📊 Smart Data Visualization

- **Auto Chart Recommendations**: AI analyzes data and suggests best chart type
- **Multiple Chart Types**: Bar, Line, Pie, Area charts with Recharts
- **Interactive & Responsive**: Beautiful charts that work on all devices

### 💡 Intelligent Insights

- **AI-Generated Summaries**: Plain English analysis of your data
- **Trend Detection**: Automatically identify patterns and changes
- **Anomaly Detection**: Flag unusual data points
- **Comparison Analysis**: Highlight top/bottom performers
- **Follow-up Questions**: Smart suggestions for deeper analysis

### 📝 Complete Query Management

- **Query History**: Track all executed queries with full audit trail
- **Search & Filter**: Find past queries instantly
- **Performance Metrics**: Execution time, result counts, success rates
- **One-Click Replay**: Re-run previous queries with a click

### 🎨 Modern Dashboard UI

- **Professional Layout**: Chat, SQL preview, data table, charts, insights
- **Dark Mode**: System-aware theme with manual toggle
- **Real-time Streaming**: See AI responses as they generate
- **Mobile Responsive**: Full functionality on phone, tablet, desktop

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- Turso database account (or use local SQLite)

### Installation

```bash
# Clone and install
git clone https://github.com/yourusername/sql-agent.git
cd sql-agent
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials:
# TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, OPENAI_API_KEY

# Run migrations
pnpm db:generate
pnpm db:migrate

# Optional: Seed database
pnpm tsx src/db/db.seed.ts

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 🎯 Try These Sample Queries

- "Show me all products"
- "What are the top 5 best-selling products?"
- "Analyze sales by region over the last month"
- "Which product category has the lowest stock?"
- "Compare revenue between North and South regions"

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide Icons
- **AI**: Vercel AI SDK, OpenAI GPT-4
- **Database**: Turso/LibSQL, Drizzle ORM
- **Visualization**: Recharts
- **Security**: node-sql-parser for SQL validation

## 📦 Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts        # Main AI chat endpoint
│   ├── api/history/route.ts     # Query history API
│   ├── api/analytics/route.ts   # Analytics & metrics
│   └── page.tsx                 # Main dashboard
├── components/                   # React components
│   ├── ChatPanel.tsx
│   ├── SQLPreview.tsx
│   ├── DataTable.tsx
│   ├── ChartView.tsx
│   ├── InsightSummary.tsx
│   ├── QueryHistory.tsx
│   └── ThemeSwitcher.tsx
├── db/                          # Database
│   ├── schema.ts
│   ├── db.ts
│   └── migrations/
└── lib/                         # Utilities
    ├── sqlValidator.ts          # SQL security & validation
    ├── chartRecommender.ts      # AI chart selection
    └── insightGenerator.ts      # AI insight generation
```

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
vercel
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add OPENAI_API_KEY
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔒 Security

- ✅ SQL injection prevention via AST parsing
- ✅ Read-only queries (SELECT only enforced)
- ✅ Query sanitization and validation
- ✅ Comprehensive audit logging
- ✅ Environment variable protection

## 📚 Learn More

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration framework
- [Drizzle ORM](https://orm.drizzle.team/) - Database toolkit
- [Next.js Documentation](https://nextjs.org/docs) - Framework docs

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

## 📝 License

MIT License - use freely for personal or commercial projects.

---

**Built with ❤️ using Next.js, TypeScript, and AI**

⭐ Star this repo if you find it useful!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
