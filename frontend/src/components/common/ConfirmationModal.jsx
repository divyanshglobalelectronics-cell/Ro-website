import React from 'react';

export default function ConfirmationModal({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
        <div className="p-4 border-b">
          <div className="text-lg font-semibold">{title || 'Confirm'}</div>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-700">{message}</div>
        </div>
        <div className="p-3 flex justify-end gap-2 border-t">
          <button onClick={onCancel} className="px-3 py-1 rounded border">{cancelLabel}</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-600 text-white">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
