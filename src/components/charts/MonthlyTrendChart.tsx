'use client';

import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartArea,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { MonthlySummary } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import { baseLineOptions } from '@/lib/chartConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
  const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
  return gradient;
}

interface MonthlyTrendChartProps {
  data: MonthlySummary[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Update gradient on re-render
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const gradient = createGradient(ctx, chartArea);
    if (chart.data.datasets[0]) {
      (chart.data.datasets[0] as { backgroundColor: unknown }).backgroundColor = gradient;
      chart.update('none');
    }
  });

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        data: data.map((d) => d.total),
        borderColor: 'rgba(99, 102, 241, 0.9)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)', // replaced by gradient in effect
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: 'rgba(255,255,255,0.3)',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <GlassCard className="p-4">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
        Monthly Spending
      </h3>
      <div className="h-52">
        <Line
          ref={chartRef}
          data={chartData}
          options={baseLineOptions}
          aria-label="Monthly spending trend chart"
        />
      </div>
    </GlassCard>
  );
}
