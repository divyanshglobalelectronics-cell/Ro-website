import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';

function ToastItem({ t, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [progressStart, setProgressStart] = useState(false);

  useEffect(() => {
    const enter = setTimeout(() => setMounted(true), 10);
    const prog = setTimeout(() => setProgressStart(true), 50);
    return () => {
      clearTimeout(enter);
      clearTimeout(prog);
    };
  }, []);

  const baseColors =
    t.type === 'error'
      ? 'bg-red-600 border-red-200 text-white'
      : t.type === 'warning'
      ? 'bg-yellow-500 border-yellow-200 text-white'
      : 'bg-green-600 border-green-200 text-white';

  return (
    <div
      className={
        `min-w-[240px] max-w-sm rounded-lg shadow-lg border px-4 py-3 text-sm flex flex-col gap-2 overflow-hidden transform transition-all duration-300 ` +
        baseColors +
        ` ` +
        (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2')
      }
    >
      <div className="flex items-start gap-3">
        <span className="mt-[2px]">{t.message}</span>
        <button onClick={onClose} className="ml-auto text-inherit/80 hover:text-inherit">×</button>
      </div>
      {t.duration > 0 && (
        <div className="h-1 w-full bg-black/10 rounded">
          <div
            className="h-1 bg-current rounded transition-[width] ease-linear"
            style={{ width: progressStart ? '0%' : '100%', transitionDuration: `${t.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}

export default function Toasts() {
  const { toasts, dismissToast } = useToast();
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} onClose={() => dismissToast(t.id)} />
      ))}
    </div>
  );
}
