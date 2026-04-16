'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { CategorySummary } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import {
  baseDoughnutOptions,
  CATEGORY_CHART_COLORS,
  CATEGORY_BORDER_COLORS,
} from '@/lib/chartConfig';
import { formatCurrency } from '@/lib/analytics';

ChartJS.register(ArcElement, Tooltip, Legend);

// Center-label plugin (rendered inline)
const centerLabelPlugin = {
  id: 'centerLabel',
  afterDraw(chart: ChartJS) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const meta = chart.getDatasetMeta(0);
    if (!meta || meta.data.length === 0) return;

    const total = (chart.data.datasets[0].data as number[]).reduce(
      (a, b) => a + b,
      0
    );
    const cx = (chartArea.left + chartArea.right) / 2;
    const cy = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = "11px 'Inter', system-ui, sans-serif";
    ctx.fillText('Total', cx, cy - 11);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = "bold 15px 'Inter', system-ui, sans-serif";
    ctx.fillText(formatCurrency(total), cx, cy + 8);

    ctx.restore();
  },
};

interface CategoryDoughnutChartProps {
  data: CategorySummary[];
}

export default function CategoryDoughnutChart({ data }: CategoryDoughnutChartProps) {
  if (data.length === 0) {
    return (
      <GlassCard className="p-4">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
          Spending by Category
        </h3>
        <div className="h-52 flex items-center justify-center text-sm text-white/30">
          No data yet
        </div>
      </GlassCard>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((_, i) => CATEGORY_CHART_COLORS[i % CATEGORY_CHART_COLORS.length]),
        borderColor: data.map((_, i) => CATEGORY_BORDER_COLORS[i % CATEGORY_BORDER_COLORS.length]),
        borderWidth: 1.5,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <GlassCard className="p-4">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
        Spending by Category
      </h3>
      <div className="h-52">
        <Doughnut
          data={chartData}
          options={baseDoughnutOptions}
          plugins={[centerLabelPlugin]}
          aria-label="Spending by category chart"
        />
      </div>
    </GlassCard>
  );
}
