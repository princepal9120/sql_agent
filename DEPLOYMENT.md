# 🚀 Deployment Guide - SQL Agent

## 📋 Prerequisites

- **Next.js / Node.js Hosting** (Vercel recommended)
- **OpenAI API Key** (for GPT-4o)
- **Database Credentials** (PostgreSQL, MySQL, or Turso/LibSQL)

---

## ☁️ Deploy to Vercel (Recommended)

The fastest way to deploy SQL Agent is using Vercel.

### 1. One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprincepal9120%2Fsql_agent&env=OPENAI_API_KEY)

### 2. Manual Deployment

**Step 1. Install CLI & Login**
```bash
npm i -g vercel
vercel login
```

**Step 2. Deploy**
Run the command from your project root:
```bash
vercel
```

**Step 3. Configure Environment Variables**
Go to your Vercel Project Settings > Environment Variables and add:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Required. Your OpenAI API key starting with `sk-...` |
| `TURSO_DATABASE_URL` | *Optional*. Default database connection string. |
| `TURSO_AUTH_TOKEN` | *Optional*. Default database auth token. |

> **Note**: Users can always connect their own database via the `/setup` wizard. The environment variables are just for setting a default system database if desired.

---

## 🛠️ Docker Deployment

SQL Agent can be containerized easily.

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Build & Run

```bash
docker build -t sql-agent .
docker run -p 3000:3000 -e OPENAI_API_KEY="sk-..." sql-agent
```

---

## 🔧 Database Setup (For Self-Hosting)

If you are hosting your own database (e.g., PostgreSQL for the app's internal usage), ensure:
1. It is accessible from your deployment provider (allowlisted IPs).
2. You provide the connection string in the wizard or env vars.

SQL Agent does **not** require a dedicated internal database to run; it connects primarily to the user's data source.

---

## 🔍 Troubleshooting

**"Connection Failed"**
- Ensure your database allows connections from the Vercel/Deployment IP.
- Check if your connection string requires SSL (`?sslmode=require`).

**"Model Overloaded" / 500 Errors**
- Check your OpenAI API credit balance.
- Verify `OPENAI_API_KEY` is correct in Vercel settings.
