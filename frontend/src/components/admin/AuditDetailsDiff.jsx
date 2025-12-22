import React from 'react';

function isObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }

function renderPrimitive(v) {
  if (v === null || typeof v === 'undefined') return <span className="text-gray-500">null</span>;
  if (typeof v === 'boolean') return <span>{String(v)}</span>;
  if (typeof v === 'number') return <span>{v}</span>;
  if (typeof v === 'string') return <span>{v}</span>;
  return <span>{String(v)}</span>;
}

function SmallJSON({ value }) {
  try {
    return <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded">{JSON.stringify(value, null, 2)}</pre>;
  } catch (e) {
    return <span>{String(value)}</span>;
  }
}

function KeyRow({ k, before, after }) {
  const changed = typeof before !== 'undefined' && typeof after !== 'undefined' && JSON.stringify(before) !== JSON.stringify(after);
  if (typeof before === 'undefined' && typeof after !== 'undefined') {
    return (
      <div className="flex items-start gap-4 py-1 border-b">
        <div className="w-40 text-xs text-gray-600">{k}</div>
        <div className="text-sm text-green-700">Added: {renderPrimitive(after)}</div>
      </div>
    );
  }
  if (typeof after === 'undefined' && typeof before !== 'undefined') {
    return (
      <div className="flex items-start gap-4 py-1 border-b">
        <div className="w-40 text-xs text-gray-600">{k}</div>
        <div className="text-sm text-red-600 line-through">Removed: {renderPrimitive(before)}</div>
      </div>
    );
  }
  if (changed) {
    return (
      <div className="flex items-start gap-4 py-1 border-b">
        <div className="w-40 text-xs text-gray-600">{k}</div>
        <div className="flex flex-col text-sm">
          <div className="text-red-600 text-xs line-through">{typeof before === 'object' ? <SmallJSON value={before} /> : String(before)}</div>
          <div className="text-green-700 mt-1">{typeof after === 'object' ? <SmallJSON value={after} /> : String(after)}</div>
        </div>
      </div>
    );
  }
  // unchanged
  return (
    <div className="flex items-start gap-4 py-1 border-b">
      <div className="w-40 text-xs text-gray-600">{k}</div>
      <div className="text-sm text-gray-700">{typeof after === 'object' ? <SmallJSON value={after} /> : String(after)}</div>
    </div>
  );
}

export default function AuditDetailsDiff({ details }) {
  if (!details) return <div className="text-gray-600">No details available</div>;

  // If the details explicitly include before/after payloads
  if (details.before && details.after && isObject(details.before) && isObject(details.after)) {
    const keys = Array.from(new Set([...Object.keys(details.before), ...Object.keys(details.after)]));
    return (
      <div className="space-y-1">
        {keys.map((k) => (
          <KeyRow key={k} k={k} before={details.before[k]} after={details.after[k]} />
        ))}
      </div>
    );
  }

  // If details contains an 'update' object (common for update actions)
  if (details.update && isObject(details.update)) {
    const keys = Object.keys(details.update);
    return (
      <div className="space-y-1">
        {keys.map((k) => (
          <KeyRow key={k} k={k} before={details.previous ? details.previous[k] : undefined} after={details.update[k]} />
        ))}
      </div>
    );
  }

  // If it's an items array (orders), render a concise table-like card
  if (Array.isArray(details.items) && details.items.length > 0) {
    return (
      <div className="overflow-auto">
        <div className="text-sm font-medium mb-2">Items</div>
        <div className="bg-white border rounded">
          <div className="grid grid-cols-4 gap-2 text-xs p-2 border-b bg-gray-50">
            <div>Title / Product</div>
            <div>Qty</div>
            <div>Price</div>
            <div>Amount</div>
          </div>
          {details.items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 text-sm p-2 border-b">
              <div>{it.title || String(it.product || '')}</div>
              <div>{it.quantity || 0}</div>
              <div>{(it.price || 0).toFixed ? (it.price || 0).toFixed(2) : String(it.price)}</div>
              <div>{((it.price || 0) * (it.quantity || 0)).toFixed ? ((it.price || 0) * (it.quantity || 0)).toFixed(2) : String((it.price || 0) * (it.quantity || 0))}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback: pretty JSON but inside a styled card, not raw pre
  return (
    <div className="bg-gray-50 p-3 rounded max-h-96 overflow-auto text-sm">
      <SmallJSON value={details} />
    </div>
  );
}
