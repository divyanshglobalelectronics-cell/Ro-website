import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext();

let idCounter = 0;

export function ToastProvider({ children }) { //toast provider component for every component
  const [toasts, setToasts] = useState([]);

  const showToast = (message, { type = 'success', duration = 3000 } = {}) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  };

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const value = useMemo(() => ({ toasts, showToast, dismissToast }), [toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
