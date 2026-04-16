export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Entertainment'
  | 'Health'
  | 'Shopping'
  | 'Education'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Health',
  'Shopping',
  'Education',
  'Other',
];

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;       // ISO date: YYYY-MM-DD
  createdAt: string;  // ISO datetime
}

export interface MonthlySummary {
  month: string; // e.g. "Jan '26"
  total: number;
}

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  percentage: number;
}

export interface DashboardStats {
  totalSpent: number;
  topCategory: ExpenseCategory | null;
  monthlyAverage: number;
  expenseCount: number;
}

export interface AIInsight {
  id: string;
  text: string;
  type: 'warning' | 'tip' | 'positive';
}
