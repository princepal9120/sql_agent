# 🤖 SQL Agent - Chat with Your Database

**Transform your database queries into insights with natural language.**  
SQL Agent is a full-stack AI-powered analytics platform that helps you understand your data instantly. Connect any SQL database, ask questions in plain English, and get interactive charts, tables, and summaries.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwindcss&style=flat-square)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-4.0-black?logo=vercel&style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Key Features

### 🚀 Easy Setup & Connection
- **Database Wizard**: Connect to **PostgreSQL**, **MySQL**, **SQLite**, or **Turso** in seconds.
- **Connection Testing**: Validate credentials before saving.
- **Secure Storage**: Credentials stored locally or via environment variables (self-hosted).

### 🧠 AI-Powered Analysis
- **Natural Language to SQL**: Ask "Show me top selling products" and get optimized SQL.
- **Multi-step Reasoning**: complex questions are broken down into logical steps.
- **Auto-Correction**: AI automatically fixes SQL syntax errors.

### 📊 Interactive Visualizations
- **Smart Charting**: Automatically selects Bar, Line, Pie, or Area charts based on data structure.
- **Dynamic Switching**: Toggle between Chart and Table views instantly.
- **Follow-up Questions**: AI suggests the next logical questions to ask.

### 🎨 Modern UI/UX
- **Chat Interface**: Familiar ChatGPT-style experience.
- **Dark Mode**: Beautiful dark theme by default, with easy toggle.
- **Responsive**: Works perfectly on desktop and mobile.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- OpenAI API Key
- A database (PostgreSQL, MySQL, SQLite, or Turso)

### 1. Clone & Install
```bash
git clone https://github.com/princepal9120/sql_agent.git
cd sql_agent
pnpm install
```

### 2. Configure Environment
Create a `.env.local` file:
```env
OPENAI_API_KEY=sk-your-key-here

# Optional: Pre-configure a default database (Turso example)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

### 3. Run Development Server
```bash
pnpm dev
# Opens at http://localhost:3000
```

### 4. Connect Your Database
Visit `http://localhost:3000/setup` to use the connection wizard, or go straight to `/chat` if you configured `.env.local`.

---

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide Icons
- **AI**: Vercel AI SDK, OpenAI GPT-4o
- **Database Access**: Drizzle ORM, `node-sql-parser` for validation
- **Visualization**: Recharts, customized Shadcn/ui components

## 📦 Project Structure
```
src/
├── app/
│   ├── api/             # API Routes (Chat, Database Config)
│   ├── chat/            # Chat Interface Page
│   ├── setup/           # Connection Wizard Page
│   └── page.tsx         # Landing Page
├── components/          # Reusable UI Components
│   ├── ChartView.tsx    # Visualization Engine
│   └── DatabaseWizard.tsx # Connection Flow
├── lib/                 # Utilities & AI Logic
│   ├── db-adapter.ts    # Dynamic DB Connection Handler
│   └── chartRecommender.ts # Visualization Logic
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.

---
**Built with ❤️ using Next.js & AI**
