import type { Expense } from '@/types';

const STORAGE_KEY = 'finance_dashboard_expenses';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getExpenses(): Expense[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function addExpense(
  data: Omit<Expense, 'id' | 'createdAt'>
): Expense {
  const expense: Expense = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const existing = getExpenses();
  saveExpenses([...existing, expense]);
  return expense;
}

export function updateExpense(
  id: string,
  updates: Partial<Omit<Expense, 'id' | 'createdAt'>>
): Expense | null {
  const expenses = getExpenses();
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;
  expenses[index] = { ...expenses[index], ...updates };
  saveExpenses(expenses);
  return expenses[index];
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses();
  saveExpenses(expenses.filter((e) => e.id !== id));
}

export function clearExpenses(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEY);
}
