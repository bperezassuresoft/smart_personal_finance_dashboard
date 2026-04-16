import { PiggyBank } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No expenses yet',
  description = 'Start tracking your spending by adding your first expense.',
  actionLabel = 'Add Expense',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400">
        <PiggyBank size={40} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white/80 mb-1">{title}</h3>
        <p className="text-sm text-white/40 max-w-xs">{description}</p>
      </div>
      {onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
