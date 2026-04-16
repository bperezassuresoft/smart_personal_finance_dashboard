import type { ChartOptions, TooltipOptions } from 'chart.js';

const tooltipDefaults: Partial<TooltipOptions<'line' | 'bar' | 'doughnut'>> = {
  backgroundColor: 'rgba(10, 10, 25, 0.92)',
  borderColor: 'rgba(99, 102, 241, 0.4)',
  borderWidth: 1,
  titleColor: 'rgba(255, 255, 255, 0.95)',
  bodyColor: 'rgba(255, 255, 255, 0.75)',
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
  boxWidth: 10,
  boxHeight: 10,
};

const tickDefaults = {
  color: 'rgba(255, 255, 255, 0.5)',
  font: { family: "'Inter', system-ui, sans-serif", size: 11 },
};

const gridDefaults = {
  color: 'rgba(255, 255, 255, 0.06)',
};

export const CATEGORY_CHART_COLORS = [
  'rgba(99,  102, 241, 0.85)',  // indigo  — Food
  'rgba(59,  130, 246, 0.85)',  // blue    — Transport
  'rgba(168,  85, 247, 0.85)',  // purple  — Housing
  'rgba(234, 179,   8, 0.85)',  // yellow  — Entertainment
  'rgba(34,  197,  94, 0.85)',  // green   — Health
  'rgba(249, 115,  22, 0.85)',  // orange  — Shopping
  'rgba(236,  72, 153, 0.85)',  // pink    — Education
  'rgba(107, 114, 128, 0.85)',  // gray    — Other
];

export const CATEGORY_BORDER_COLORS = CATEGORY_CHART_COLORS.map((c) =>
  c.replace('0.85', '1')
);

export const baseLineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: tooltipDefaults as TooltipOptions<'line'>,
  },
  scales: {
    x: {
      grid: gridDefaults,
      ticks: tickDefaults,
      border: { display: false },
    },
    y: {
      grid: gridDefaults,
      ticks: {
        ...tickDefaults,
        callback: (v) => `$${Number(v).toLocaleString()}`,
      },
      border: { display: false },
    },
  },
};

export const baseDoughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: { family: "'Inter', system-ui, sans-serif", size: 11 },
        padding: 14,
        boxWidth: 12,
        boxHeight: 12,
      },
    },
    tooltip: tooltipDefaults as TooltipOptions<'doughnut'>,
  },
  cutout: '65%',
};

export const baseBarOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: tooltipDefaults as TooltipOptions<'bar'>,
  },
  scales: {
    x: {
      grid: { ...gridDefaults, display: false },
      ticks: tickDefaults,
      border: { display: false },
    },
    y: {
      grid: gridDefaults,
      ticks: {
        ...tickDefaults,
        callback: (v) => `$${Number(v).toLocaleString()}`,
      },
      border: { display: false },
    },
  },
};
