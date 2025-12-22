import React from 'react';

// Very small sparkline: accepts series = [{ period: 'YYYY-MM', revenue: 123 }, ...] or array of numbers
export default function Sparkline({ series = [], width = 160, height = 40, color = '#2563EB' }) {
  let values = [];
  if (Array.isArray(series) && series.length) {
    if (typeof series[0] === 'number') values = series;
    else if (typeof series[0] === 'object') {
      const vKey = series[0].revenue !== undefined ? 'revenue' : (series[0].value !== undefined ? 'value' : null);
      values = vKey ? series.map(s => Number(s[vKey] || 0)) : series.map((s, i) => i);
    }
  }
  if (!values.length) return <div className="text-xs text-gray-500">No data</div>;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const len = values.length;
  const gap = width / Math.max(1, len - 1);
  const points = values.map((v, i) => {
    const x = i * gap;
    const y = max === min ? height / 2 : height - ((v - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
