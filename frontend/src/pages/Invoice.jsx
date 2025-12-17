import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../common/Loader.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet(`/api/orders/${id}`, token);
        if (!mounted) return;
        setOrder(data);
      } catch (e) {
        setError(e.message || 'Failed to load invoice');
        showToast(e.message || 'Failed to load invoice', { type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, token, showToast]);

  if (loading) return <Loader label="Loading invoice..." />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Could not load invoice</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <button className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg" onClick={() => navigate('/orders')}>Go to My Orders</button>
      </div>
    </div>
  );

  const subtotal = order?.subtotal || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-8 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <p className="text-gray-600 mt-1">Order ID: {order?._id}</p>
            <p className="text-gray-600">Created: {new Date(order?.createdAt).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Status</div>
            <div className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${order?.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
              {order?.status}
            </div>
          </div>
        </div>

        <div className="p-8 grid sm:grid-cols-2 gap-6 border-b border-gray-200">
          <div>
            <h2 className="font-bold text-gray-900 mb-2">Billed To</h2>
            <div className="text-gray-700 text-sm space-y-1">
              <div>{order?.customer?.name}</div>
              <div>{order?.customer?.phone}</div>
              <div>{order?.customer?.email}</div>
              <div>{order?.customer?.address}</div>
              <div>{order?.customer?.city} {order?.customer?.pincode}</div>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 mb-2">Payment</h2>
            <div className="text-gray-700 text-sm space-y-1">
              <div>Method: {order?.paymentMethod?.toUpperCase?.() || 'N/A'}</div>
              <div>Subtotal: ₹ {subtotal.toLocaleString('en-IN')}</div>
              <div>Shipping: ₹ 0</div>
              <div className="font-semibold">Total: ₹ {subtotal.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h2 className="font-bold text-gray-900 mb-4">Items</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 border-b">Item</th>
                  <th className="text-right px-4 py-3 border-b">Qty</th>
                  <th className="text-right px-4 py-3 border-b">Price</th>
                  <th className="text-right px-4 py-3 border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order?.items?.map((it, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3">{it.title}</td>
                    <td className="px-4 py-3 text-right">{it.quantity}</td>
                    <td className="px-4 py-3 text-right">₹ {it.price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">₹ {(it.price * it.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="px-5 py-3 border border-gray-300 rounded-lg" onClick={() => navigate('/orders')}>Go to My Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
}
