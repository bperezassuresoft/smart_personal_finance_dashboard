'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Expense, ExpenseCategory } from '@/types';
import { EXPENSE_CATEGORIES } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import EmptyState from '@/components/ui/EmptyState';
import ExpenseRow from './ExpenseRow';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const ALL_CATEGORIES = 'All';

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  onAddNew,
}: ExpenseListProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);

  const filtered = useMemo(() => {
    let result = [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.description.toLowerCase().includes(q));
    }
    if (categoryFilter !== ALL_CATEGORIES) {
      result = result.filter((e) => e.category === categoryFilter);
    }
    return result;
  }, [expenses, search, categoryFilter]);

  const filterOptions = [ALL_CATEGORIES, ...EXPENSE_CATEGORIES];

  return (
    <GlassCard className="flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-white/[0.07]">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Transactions
          {expenses.length > 0 && (
            <span className="ml-2 text-white/40 font-normal normal-case tracking-normal">
              ({filtered.length} of {expenses.length})
            </span>
          )}
        </h2>

        <div className="flex gap-2 sm:ml-auto">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search expenses"
              className="input-dark pl-8 h-8 text-xs w-36 sm:w-44"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="input-dark h-8 text-xs cursor-pointer appearance-none px-2 [&>option]:bg-slate-900"
          >
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {expenses.length === 0 ? (
        <EmptyState onAction={onAddNew} />
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-white/40">
          No expenses match your filters.
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table
            className="w-full"
            role="table"
            aria-label="Expense transactions"
          >
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Date', 'Description', 'Category', 'Amount', ''].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className={`px-4 py-2.5 text-xs font-medium text-white/40 uppercase tracking-wider ${
                      h === 'Amount' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
}
