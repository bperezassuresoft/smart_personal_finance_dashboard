'use client';

import { useState } from 'react';
import type { Expense, ExpenseCategory } from '@/types';
import { EXPENSE_CATEGORIES } from '@/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface FormData {
  amount: string;
  category: ExpenseCategory | '';
  description: string;
  date: string;
}

interface FormErrors {
  amount?: string;
  category?: string;
  description?: string;
  date?: string;
}

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  const amount = parseFloat(data.amount);
  if (!data.amount || isNaN(amount) || amount <= 0) {
    errors.amount = 'Enter a valid amount greater than $0.00';
  }
  if (!data.category) {
    errors.category = 'Please select a category';
  }
  if (!data.description || data.description.trim().length < 2) {
    errors.description = 'Description must be at least 2 characters';
  }
  if (data.description.trim().length > 100) {
    errors.description = 'Description must be 100 characters or fewer';
  }
  if (!data.date) {
    errors.date = 'Please select a date';
  }
  return errors;
}

export default function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [form, setForm] = useState<FormData>({
    amount: initialData ? String(initialData.amount) : '',
    category: initialData?.category ?? '',
    description: initialData?.description ?? '',
    date: initialData?.date ?? todayISO(),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  }

  function handleBlur(field: keyof FormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      (Object.keys(form) as (keyof FormData)[]).map((k) => [k, true])
    );
    setTouched(allTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      amount: parseFloat(form.amount),
      category: form.category as ExpenseCategory,
      description: form.description.trim(),
      date: form.date,
    });
  }

  const categoryOptions = EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }));

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Amount */}
      <Input
        id="amount"
        label="Amount ($)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={form.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
        onBlur={() => handleBlur('amount')}
        error={touched.amount ? errors.amount : undefined}
      />

      {/* Category */}
      <Select
        id="category"
        label="Category"
        options={categoryOptions}
        placeholder="Select a category…"
        value={form.category}
        onChange={(e) => handleChange('category', e.target.value)}
        onBlur={() => handleBlur('category')}
        error={touched.category ? errors.category : undefined}
      />

      {/* Description */}
      <Input
        id="description"
        label="Description"
        type="text"
        maxLength={100}
        placeholder="e.g. Lunch at Chipotle"
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        error={touched.description ? errors.description : undefined}
      />

      {/* Date */}
      <Input
        id="date"
        label="Date"
        type="date"
        value={form.date}
        max={todayISO()}
        onChange={(e) => handleChange('date', e.target.value)}
        onBlur={() => handleBlur('date')}
        error={touched.date ? errors.date : undefined}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          {initialData ? 'Save Changes' : 'Add Expense'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
