'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, Lightbulb, TrendingUp, RefreshCw, WifiOff, Sparkles } from 'lucide-react';
import type { Expense, AIInsight } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface InsightsPanelProps {
  expenses: Expense[];
}

const TYPE_CONFIG: Record<
  AIInsight['type'],
  { Icon: typeof AlertTriangle; borderColor: string; iconColor: string; bgColor: string }
> = {
  warning: {
    Icon: AlertTriangle,
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/[0.07]',
  },
  tip: {
    Icon: Lightbulb,
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/[0.07]',
  },
  positive: {
    Icon: TrendingUp,
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/[0.07]',
  },
};

function SkeletonInsight() {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] animate-pulse">
      <div className="w-7 h-7 rounded-lg bg-white/10 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-white/10 rounded w-4/5" />
        <div className="h-3 bg-white/10 rounded w-3/5" />
      </div>
    </div>
  );
}

export default function InsightsPanel({ expenses }: InsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchInsights = useCallback(async () => {
    if (expenses.length === 0) {
      setInsights([]);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses }),
      });
      const data = await res.json() as { insights: AIInsight[]; error?: string };
      setInsights(data.insights ?? []);
      if (data.error) setError(true);
    } catch {
      setError(true);
      setInsights([]);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [expenses]);

  // Auto-fetch on mount; debounce subsequent expense changes
  useEffect(() => {
    if (!hasLoaded) {
      fetchInsights();
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchInsights, 2000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [expenses, fetchInsights, hasLoaded]);

  return (
    <GlassCard className="p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-400" />
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            AI Insights
          </h3>
        </div>
        <Button
          variant="icon"
          onClick={fetchInsights}
          disabled={loading || expenses.length === 0}
          aria-label="Refresh insights"
          title="Refresh insights"
          className="w-7 h-7"
        >
          <RefreshCw
            size={12}
            className={loading ? 'animate-spin' : ''}
          />
        </Button>
      </div>

      {/* States */}
      {expenses.length === 0 ? (
        <p className="text-xs text-white/30 text-center py-6">
          Add expenses to unlock AI insights.
        </p>
      ) : loading ? (
        <div className="flex flex-col gap-2">
          <SkeletonInsight />
          <SkeletonInsight />
          <SkeletonInsight />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <WifiOff size={20} className="text-white/20" />
          <p className="text-xs text-white/30">
            Couldn&apos;t load insights. Check your API key and try again.
          </p>
        </div>
      ) : insights.length === 0 ? (
        <p className="text-xs text-white/30 text-center py-6">
          No insights available yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {insights.map((insight) => {
            const { Icon, borderColor, iconColor, bgColor } = TYPE_CONFIG[insight.type];
            return (
              <div
                key={insight.id}
                className={`flex gap-3 p-3 rounded-xl border ${borderColor} ${bgColor}`}
              >
                <div className={`shrink-0 mt-0.5 ${iconColor}`}>
                  <Icon size={14} strokeWidth={2} />
                </div>
                <p className="text-xs text-white/75 leading-relaxed">{insight.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
