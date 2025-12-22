import React from 'react';

export default function Skeleton({ rows = 4, cols = 1, className = '' }) {
  const rowArray = Array.from({ length: rows });
  return (
    <div className={`space-y-3 ${className}`}>
      {rowArray.map((_, i) => (
        <div key={i} className="animate-pulse flex gap-3 items-center">
          <div className="w-12 h-12 bg-gray-300 rounded" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
