'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  DollarSign,
  Tag,
  TrendingUp,
  LayoutList,
  Plus,
  Database,
  Trash2,
} from 'lucide-react';

import { useExpenses } from '@/hooks/useExpenses';
import { getDashboardStats, getCategorySummaries, getMonthlyTotals, getWeeklyTotals, formatCurrency } from '@/lib/analytics';
import { SEED_EXPENSES } from '@/lib/seedData';
import type { Expense } from '@/types';

import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpenseList from '@/components/expenses/ExpenseList';
import InsightsPanel from '@/components/insights/InsightsPanel';

// Dynamic imports — chart.js requires client-side canvas
const MonthlyTrendChart = dynamic(
  () => import('@/components/charts/MonthlyTrendChart'),
  { ssr: false }
);
const CategoryDoughnutChart = dynamic(
  () => import('@/components/charts/CategoryDoughnutChart'),
  { ssr: false }
);
const WeeklyBarChart = dynamic(
  () => import('@/components/charts/WeeklyBarChart'),
  { ssr: false }
);

type ModalMode = 'add' | 'edit';

export default function DashboardPage() {
  const { expenses, addExpense, updateExpense, deleteExpense, clearExpenses, loadSeedData } =
    useExpenses();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  // ── Analytics (memoised) ──────────────────────────────────────────
  const stats = useMemo(() => getDashboardStats(expenses), [expenses]);
  const categorySummaries = useMemo(() => getCategorySummaries(expenses), [expenses]);
  const monthlyTotals = useMemo(() => getMonthlyTotals(expenses, 6), [expenses]);
  const weeklyTotals = useMemo(() => getWeeklyTotals(expenses), [expenses]);

  // ── Modal helpers ─────────────────────────────────────────────────
  function openAddModal() {
    setModalMode('add');
    setEditingExpense(null);
    setModalOpen(true);
  }

  function openEditModal(id: string) {
    const expense = expenses.find((e) => e.id === id);
    if (!expense) return;
    setModalMode('edit');
    setEditingExpense(expense);
    setModalOpen(true);
  }

  function handleFormSubmit(data: Omit<Expense, 'id' | 'createdAt'>) {
    if (modalMode === 'add') {
      addExpense(data);
    } else if (editingExpense) {
      updateExpense(editingExpense.id, data);
    }
    setModalOpen(false);
    setEditingExpense(null);
  }

  function handleLoadDemo() {
    loadSeedData(SEED_EXPENSES);
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/70 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <DollarSign size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm gradient-text hidden sm:block">
              Finance Dashboard
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {expenses.length === 0 && (
              <Button variant="ghost" onClick={handleLoadDemo} className="text-xs">
                <Database size={13} />
                <span className="hidden sm:inline">Load Demo</span>
              </Button>
            )}
            {expenses.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setClearConfirmOpen(true)}
                className="text-xs text-red-400/70 hover:text-red-300 border-red-500/20 hover:bg-red-500/10"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            )}
            <Button variant="primary" onClick={openAddModal} className="text-xs">
              <Plus size={14} />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">

        {/* ── Stats row ──────────────────────────────────────────────── */}
        <section
          aria-label="Summary Statistics"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <StatCard
            icon={DollarSign}
            label="Total Spent"
            value={formatCurrency(stats.totalSpent)}
            iconColor="text-indigo-400"
          />
          <StatCard
            icon={Tag}
            label="Top Category"
            value={stats.topCategory ?? '—'}
            iconColor="text-purple-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Monthly Avg"
            value={formatCurrency(stats.monthlyAverage)}
            iconColor="text-emerald-400"
          />
          <StatCard
            icon={LayoutList}
            label="Transactions"
            value={String(stats.expenseCount)}
            iconColor="text-blue-400"
          />
        </section>

        {/* ── Dashboard grid ─────────────────────────────────────────── */}
        <section
          aria-label="Spending Charts and Transactions"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Left column — charts + transactions */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <MonthlyTrendChart data={monthlyTotals} />
            <WeeklyBarChart data={weeklyTotals} />
            <ExpenseList
              expenses={expenses}
              onEdit={openEditModal}
              onDelete={deleteExpense}
              onAddNew={openAddModal}
            />
          </div>

          {/* Right column — doughnut + insights */}
          <div className="flex flex-col gap-4">
            <CategoryDoughnutChart data={categorySummaries} />
            <InsightsPanel expenses={expenses} />
          </div>
        </section>
      </main>

      {/* ── Add / Edit Expense Modal ────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingExpense(null);
        }}
        title={modalMode === 'add' ? 'Add Expense' : 'Edit Expense'}
      >
        <ExpenseForm
          initialData={editingExpense ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingExpense(null);
          }}
        />
      </Modal>

      {/* ── Clear All Confirmation Modal ────────────────────────────── */}
      <Modal
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        title="Clear All Data"
      >
        <p className="text-sm text-white/70 mb-5">
          This will permanently delete all{' '}
          <span className="font-semibold text-white">{expenses.length}</span> expense
          {expenses.length !== 1 ? 's' : ''}. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              clearExpenses();
              setClearConfirmOpen(false);
            }}
          >
            <Trash2 size={14} />
            Clear All
          </Button>
          <Button variant="ghost" onClick={() => setClearConfirmOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
