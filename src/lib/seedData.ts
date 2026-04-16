import type { Expense } from '@/types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export const SEED_EXPENSES: Omit<Expense, 'id' | 'createdAt'>[] = [
  // ── Food ────────────────────────────────────────────────────────────
  { amount: 12.50,   category: 'Food',          description: 'Lunch at Chipotle',              date: daysAgo(1)  },
  { amount: 87.34,   category: 'Food',          description: 'Weekly groceries — Whole Foods', date: daysAgo(3)  },
  { amount: 6.75,    category: 'Food',          description: 'Morning coffee & pastry',         date: daysAgo(5)  },
  { amount: 45.00,   category: 'Food',          description: 'Dinner with friends',             date: daysAgo(8)  },
  { amount: 22.40,   category: 'Food',          description: 'Sushi takeout',                   date: daysAgo(14) },
  { amount: 93.60,   category: 'Food',          description: 'Bi-weekly grocery shopping',      date: daysAgo(17) },
  { amount: 18.90,   category: 'Food',          description: 'Pizza delivery',                  date: daysAgo(22) },
  { amount: 11.20,   category: 'Food',          description: 'Smoothie & sandwich',             date: daysAgo(26) },
  { amount: 78.50,   category: 'Food',          description: "Groceries — Trader Joe's",        date: daysAgo(35) },
  { amount: 34.00,   category: 'Food',          description: 'Brunch at local café',            date: daysAgo(40) },
  // ── Transport ───────────────────────────────────────────────────────
  { amount: 65.00,   category: 'Transport',     description: 'Monthly bus pass',                date: daysAgo(2)  },
  { amount: 28.40,   category: 'Transport',     description: 'Uber rides — weekly total',       date: daysAgo(6)  },
  { amount: 55.00,   category: 'Transport',     description: 'Gas station fill-up',             date: daysAgo(12) },
  { amount: 18.50,   category: 'Transport',     description: 'Downtown parking',                date: daysAgo(19) },
  { amount: 55.00,   category: 'Transport',     description: 'Gas station fill-up',             date: daysAgo(42) },
  // ── Housing ─────────────────────────────────────────────────────────
  { amount: 1450.00, category: 'Housing',       description: 'Monthly rent',                    date: daysAgo(15) },
  { amount: 85.20,   category: 'Housing',       description: 'Electric & gas utilities',        date: daysAgo(16) },
  { amount: 45.00,   category: 'Housing',       description: 'Internet bill',                   date: daysAgo(16) },
  { amount: 1450.00, category: 'Housing',       description: 'Monthly rent',                    date: daysAgo(45) },
  { amount: 85.20,   category: 'Housing',       description: 'Electric & gas utilities',        date: daysAgo(46) },
  // ── Entertainment ───────────────────────────────────────────────────
  { amount: 15.99,   category: 'Entertainment', description: 'Netflix subscription',            date: daysAgo(4)  },
  { amount: 9.99,    category: 'Entertainment', description: 'Spotify premium',                 date: daysAgo(4)  },
  { amount: 32.00,   category: 'Entertainment', description: 'Movie tickets ×2',               date: daysAgo(10) },
  { amount: 75.00,   category: 'Entertainment', description: 'Concert ticket',                  date: daysAgo(20) },
  // ── Health ──────────────────────────────────────────────────────────
  { amount: 120.00,  category: 'Health',        description: 'Monthly gym membership',          date: daysAgo(7)  },
  { amount: 45.00,   category: 'Health',        description: 'Doctor co-pay',                   date: daysAgo(23) },
  { amount: 28.60,   category: 'Health',        description: 'Pharmacy — prescriptions',        date: daysAgo(30) },
  // ── Shopping ────────────────────────────────────────────────────────
  { amount: 129.99,  category: 'Shopping',      description: 'Running shoes — Nike',            date: daysAgo(9)  },
  { amount: 54.50,   category: 'Shopping',      description: 'Clothing — H&M',                  date: daysAgo(25) },
  { amount: 39.99,   category: 'Shopping',      description: 'Amazon household items',          date: daysAgo(33) },
  // ── Education ───────────────────────────────────────────────────────
  { amount: 29.99,   category: 'Education',     description: 'Udemy — React Advanced course',   date: daysAgo(11) },
  { amount: 14.99,   category: 'Education',     description: 'Kindle — System Design book',     date: daysAgo(28) },
  // ── Other ───────────────────────────────────────────────────────────
  { amount: 25.00,   category: 'Other',         description: 'Haircut',                         date: daysAgo(13) },
  { amount: 18.00,   category: 'Other',         description: 'Dry cleaning',                    date: daysAgo(27) },
];
