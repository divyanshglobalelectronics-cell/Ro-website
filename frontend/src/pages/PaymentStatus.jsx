import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function PaymentStatus() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { showToast } = useToast();

  const status = sp.get('status') || 'failure';
  const ok = sp.get('ok') === '1';
  const txnid = sp.get('txnid') || '';
  const orderId = sp.get('orderId') || '';

  const handledRef = useRef(false);
  useEffect(() => {
    if (handledRef.current) return;
    if (ok && status.toLowerCase() === 'success') {
      handledRef.current = true;
      clearCart();
      showToast('Payment successful! Generating invoice...', { type: 'success' });
      if (orderId) {
        const t = setTimeout(() => navigate(`/invoice/${orderId}`), 600);
        return () => clearTimeout(t);
      }
    }
  }, [ok, status, clearCart, showToast, navigate, orderId]);

  return (
    <div className="min-h-screen bg-gray-50 py-14">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow p-8">
        <h1 className={`text-3xl font-bold ${ok ? 'text-green-600' : 'text-red-600'}`}>
          {ok ? 'Payment Successful' : 'Payment Failed'}
        </h1>
        <p className="mt-2 text-gray-700">Transaction ID: {txnid.substring(0,4) || 'N/A'}...</p>
        <p className="mt-1 text-gray-600">Status from gateway: {status}</p>

        <div className="mt-8 flex gap-3">
          <button
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
          {ok && orderId ? (
            <button
              className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              onClick={() => navigate(`/invoice/${orderId}`)}
            >
              View Invoice
            </button>
          ) : null}
          <button
            className="px-5 py-3 border border-gray-300 rounded-lg"
            onClick={() => navigate('/orders')}
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}
