import type {
  Expense,
  ExpenseCategory,
  DashboardStats,
  CategorySummary,
  MonthlySummary,
} from '@/types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  // Parse as local date to avoid timezone shifting
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDashboardStats(expenses: Expense[]): DashboardStats {
  if (expenses.length === 0) {
    return { totalSpent: 0, topCategory: null, monthlyAverage: 0, expenseCount: 0 };
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
  for (const e of expenses) {
    categoryTotals[e.category] = (categoryTotals[e.category] ?? 0) + e.amount;
  }

  const topCategory = (
    Object.entries(categoryTotals).sort(([, a], [, b]) => b! - a!)[0]?.[0] ?? null
  ) as ExpenseCategory | null;

  const months = new Set(expenses.map((e) => e.date.substring(0, 7)));
  const monthlyAverage = months.size > 0 ? totalSpent / months.size : 0;

  return { totalSpent, topCategory, monthlyAverage, expenseCount: expenses.length };
}

export function getCategorySummaries(expenses: Expense[]): CategorySummary[] {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  if (total === 0) return [];

  const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
  for (const e of expenses) {
    categoryTotals[e.category] = (categoryTotals[e.category] ?? 0) + e.amount;
  }

  return Object.entries(categoryTotals)
    .map(([category, catTotal]) => ({
      category: category as ExpenseCategory,
      total: catTotal!,
      percentage: Math.round((catTotal! / total) * 100),
    }))
    .sort((a, b) => b.total - a.total);
}

export function getMonthlyTotals(
  expenses: Expense[],
  months = 6
): MonthlySummary[] {
  const result: MonthlySummary[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const total = expenses
      .filter((e) => e.date.startsWith(yearMonth))
      .reduce((sum, e) => sum + e.amount, 0);
    result.push({ month: label, total });
  }

  return result;
}

export function getWeeklyTotals(
  expenses: Expense[]
): { week: string; total: number }[] {
  const result: { week: string; total: number }[] = [];
  const now = new Date();
  // Normalize to start of today
  now.setHours(0, 0, 0, 0);

  for (let i = 3; i >= 0; i--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);

    const startStr = weekStart.toISOString().split('T')[0];
    const endStr = weekEnd.toISOString().split('T')[0];

    const total = expenses
      .filter((e) => e.date >= startStr && e.date <= endStr)
      .reduce((sum, e) => sum + e.amount, 0);

    const label = weekStart.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    result.push({ week: label, total });
  }

  return result;
}
