import { cn } from '@/lib/utils';
import type { ExpenseCategory } from '@/types';

const CATEGORY_STYLES: Record<ExpenseCategory, string> = {
  Food:          'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Transport:     'bg-blue-500/20    text-blue-300    border-blue-500/30',
  Housing:       'bg-purple-500/20  text-purple-300  border-purple-500/30',
  Entertainment: 'bg-yellow-500/20  text-yellow-300  border-yellow-500/30',
  Health:        'bg-rose-500/20    text-rose-300    border-rose-500/30',
  Shopping:      'bg-orange-500/20  text-orange-300  border-orange-500/30',
  Education:     'bg-pink-500/20    text-pink-300    border-pink-500/30',
  Other:         'bg-slate-500/20   text-slate-300   border-slate-500/30',
};

interface BadgeProps {
  category: ExpenseCategory;
  className?: string;
}

export default function Badge({ category, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
        CATEGORY_STYLES[category],
        className
      )}
    >
      {category}
    </span>
  );
}
