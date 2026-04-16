# Smart Personal Finance Dashboard

A dynamic full-stack web application for tracking personal expenses with AI-powered financial insights.

Built with Next.js, Chart.js, Lucide icons, and the Anthropic Claude API. Styled with Glassmorphism and a professional dark theme.

---

## Features

- **Expense Tracking** — Add, edit, and delete expenses with category, amount, date, and description
- **Dashboard Stats** — Total spent, top category, monthly average, and transaction count
- **3 Chart Types** — Monthly trend (line), spending by category (doughnut), weekly breakdown (bar)
- **AI Insights** — Personalized financial analysis powered by Claude Haiku
- **Glassmorphism UI** — Frosted-glass cards, blur effects, dark gradient background
- **Demo Mode** — Load realistic sample data instantly with "Load Demo"
- **Responsive** — Mobile-first layout, works on all screen sizes
- **Persistent** — Data stored in browser `localStorage`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 + Glassmorphism utilities |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| AI | Anthropic Claude API (`claude-haiku-4-5-20251001`) |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Local Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd smart_personal_finance_dashboard

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key for AI insights |

Add this to `.env.local` for local development, and to your Vercel project settings for production.

---

## Project Structure

```
src/
├── app/
│   ├── api/insights/route.ts   # AI insights API route
│   ├── globals.css             # Tailwind + Glassmorphism utilities
│   ├── layout.tsx              # Root layout with Inter font
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── charts/                 # MonthlyTrendChart, CategoryDoughnutChart, WeeklyBarChart
│   ├── expenses/               # ExpenseForm, ExpenseList, ExpenseRow
│   ├── insights/               # InsightsPanel
│   └── ui/                     # GlassCard, StatCard, Badge, Button, Input, Select, Modal, EmptyState
├── hooks/
│   └── useExpenses.ts          # localStorage state management
├── lib/
│   ├── analytics.ts            # Pure data aggregation utilities
│   ├── chartConfig.ts          # Shared Chart.js dark-theme config
│   ├── seedData.ts             # Demo expense data
│   ├── storage.ts              # localStorage CRUD layer
│   └── utils.ts                # cn() utility (clsx + tailwind-merge)
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

---

## Deployment

This project is configured for one-click Vercel deployment.

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` in **Project Settings → Environment Variables**
4. Deploy

The `vercel.json` file is pre-configured for Next.js.
