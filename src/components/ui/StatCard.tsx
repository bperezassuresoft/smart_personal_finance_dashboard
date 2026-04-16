import { type LucideIcon } from 'lucide-react';
import GlassCard from './GlassCard';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  iconColor = 'text-indigo-400',
  trend,
}: StatCardProps) {
  return (
    <GlassCard className="p-5 flex items-start gap-4">
      {/* Icon container */}
      <div className={`p-2.5 rounded-xl bg-white/[0.07] shrink-0 ${iconColor}`}>
        <Icon size={20} strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/50 uppercase tracking-wider font-medium mb-0.5">
          {label}
        </p>
        <p className="text-xl font-semibold text-white truncate">{value}</p>
        {subValue && (
          <p className="text-xs text-white/40 mt-0.5 truncate">{subValue}</p>
        )}
      </div>

      {/* Trend indicator */}
      {trend && trend !== 'neutral' && (
        <span
          className={`text-xs font-medium shrink-0 mt-1 ${
            trend === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
    </GlassCard>
  );
}
