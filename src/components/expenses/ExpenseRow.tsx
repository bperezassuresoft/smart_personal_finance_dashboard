'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/lib/analytics';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseRow({ expense, onEdit, onDelete }: ExpenseRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <tr className="group border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors">
        {/* Date */}
        <td className="px-4 py-3 text-sm text-white/50 whitespace-nowrap">
          {formatDate(expense.date)}
        </td>

        {/* Description */}
        <td className="px-4 py-3 text-sm text-white/85 max-w-[200px]">
          <span className="block truncate" title={expense.description}>
            {expense.description}
          </span>
        </td>

        {/* Category */}
        <td className="px-4 py-3">
          <Badge category={expense.category} />
        </td>

        {/* Amount */}
        <td className="px-4 py-3 text-sm font-semibold text-white text-right whitespace-nowrap">
          {formatCurrency(expense.amount)}
        </td>

        {/* Actions */}
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="icon"
              onClick={() => onEdit(expense.id)}
              aria-label={`Edit ${expense.description}`}
              title="Edit"
            >
              <Pencil size={13} />
            </Button>
            <Button
              variant="icon"
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete ${expense.description}`}
              title="Delete"
              className="hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </td>
      </tr>

      {/* Delete confirmation */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Expense"
      >
        <p className="text-sm text-white/70 mb-5">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-white">&quot;{expense.description}&quot;</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              onDelete(expense.id);
              setConfirmOpen(false);
            }}
          >
            <Trash2 size={14} />
            Delete
          </Button>
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
