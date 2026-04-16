'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import GlassCard from '@/components/ui/GlassCard';
import { baseBarOptions } from '@/lib/chartConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface WeeklyBarChartProps {
  data: { week: string; total: number }[];
}

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const chartData = {
    labels: data.map((d) => `w/o ${d.week}`),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: 'rgba(99, 102, 241, 0.55)',
        borderColor: 'rgba(99, 102, 241, 0.9)',
        borderWidth: 1.5,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  return (
    <GlassCard className="p-4">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">
        Weekly Breakdown
      </h3>
      <div className="h-44">
        <Bar
          data={chartData}
          options={baseBarOptions}
          aria-label="Weekly spending bar chart"
        />
      </div>
    </GlassCard>
  );
}
