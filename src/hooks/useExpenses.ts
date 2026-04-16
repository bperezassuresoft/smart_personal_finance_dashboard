'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Expense } from '@/types';
import {
  getExpenses,
  addExpense as storageAdd,
  updateExpense as storageUpdate,
  deleteExpense as storageDelete,
  clearExpenses as storageClear,
} from '@/lib/storage';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  const addExpense = useCallback(
    (data: Omit<Expense, 'id' | 'createdAt'>): Expense => {
      const expense = storageAdd(data);
      setExpenses((prev) => [...prev, expense]);
      return expense;
    },
    []
  );

  const updateExpense = useCallback(
    (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): Expense | null => {
      const updated = storageUpdate(id, updates);
      if (updated) {
        setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
      }
      return updated;
    },
    []
  );

  const deleteExpense = useCallback((id: string): void => {
    storageDelete(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearExpenses = useCallback((): void => {
    storageClear();
    setExpenses([]);
  }, []);

  const loadSeedData = useCallback(
    (seedItems: Omit<Expense, 'id' | 'createdAt'>[]): void => {
      const newExpenses: Expense[] = seedItems.map((item) => storageAdd(item));
      setExpenses((prev) => [...prev, ...newExpenses]);
    },
    []
  );

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    clearExpenses,
    loadSeedData,
  };
}
