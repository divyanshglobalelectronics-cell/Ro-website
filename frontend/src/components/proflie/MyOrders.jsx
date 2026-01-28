import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Loader from '../../common/Loader.jsx';

export default function MyOrders() {
  const { user, token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate(`/login?returnTo=${encodeURIComponent('/orders')}`);
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/orders/mine', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load orders');
        const uid = user?._id || user?.id;
        const onlyMine = (data.orders || []).filter(o => uid && String(o.user) === String(uid));
        setOrders(onlyMine);
        // console.log(data);
      } catch (e) {
        setError(e.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, user]);
  const getNameandEmail = useCallback(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    } else {
      setName('');
      setEmail('');
    }
  }, [user]);
  useEffect(() => {
    getNameandEmail();
  }, [user, getNameandEmail]);
  if (authLoading) return <Loader label="Loading profile..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#484b8b] to-[#1b083a] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex items-center justify-between gap-2 mb-4'>
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-white">My Orders</h1>
            <p className="mt-2 text-white">Track and manage your purchases</p>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-black">{name}</h1>
            <p className="text-xl mt-2 font-bold black">{email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
            ✗ {error}
          </div>
        )}

        {loading ? (
          <Loader label="Fetching your orders..." />
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-lg text-black font-bold">Order ID</div>
                    <div className="font-mono font-bold text-lg text-gray-900">{o._id?.substring(0, 8)}...</div>
                  </div>
                  <div className="text-right flex flex-col items-center">
                    <div className="text-lg text-black mb-1 font-bold">Status</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      o.status === 'processing' ? 'bg-blue-400 text-white' :
                        o.status === 'confirmed' ? 'bg-green-600 text-white' :
                          'bg-red-600 text-black'
                      }`}>
                      {o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}
                    </div>
                    {o.refunded && (
                      <div className="mt-2 text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-semibold uppercase">Refunded</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Date</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{new Date(o.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Items</h3>
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-700">{it.title} <span className="text-gray-500">× {it.quantity}</span></span>
                          <span>{it.description}</span>
                        </div>
                        <span className="font-medium text-gray-900">₹ {(it.price * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-gray-900">Subtotal</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">₹ {o.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  {/* {o.refunded && (
                    <div className="mt-1 flex justify-between items-baseline text-sm">
                      <span className="text-gray-700">Refund</span>
                      <span className="font-semibold text-red-600">₹ {(o.refundAmount || 0).toLocaleString('en-IN')} {o.refundedAt ? `• ${new Date(o.refundedAt).toLocaleDateString('en-GB')}` : ''}</span>
                    </div>
                  )} */}

                  {/* Request Refund */}
                  {/*{(() => {
                    const delivered = String(o.status).toLowerCase() === 'delivered';
                    const created = o.createdAt ? new Date(o.createdAt) : null;
                    const windowDays = 7; // keep in sync with backend REFUND_WINDOW_DAYS
                    let within = false;
                    if (created) {
                      const deadline = new Date(created);
                      deadline.setDate(deadline.getDate() + windowDays);
                      within = new Date() <= deadline;
                    }
                    const eligible = delivered && within;
                    return (
                      <div className="mt-4">
                        <button
                          disabled={!eligible}
                          onClick={() => { setRefundOrderId(o._id); setRefundOpen(true); setRefundReason(''); setRefundAmount(''); }}
                          className={`px-4 py-2 rounded ${eligible ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                        >Request Refund</button>
                        {!eligible && (
                          <div className="text-xs text-gray-500 mt-1">Refunds allowed within {windowDays} days of delivery.</div>
                        )}
                      </div>
                    );
                  })()}*/}
                </div>
              </div>
            ))}

            {orders.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-lg text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500 mt-1">Start shopping to place your first order!</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Refund Modal */}
      {refundOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
            <div className="text-lg font-semibold mb-2">Request Refund</div>
            <div className="text-sm text-gray-600 mb-3">Order ID: <span className="font-mono">{refundOrderId}</span></div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea value={refundReason} onChange={e=>setRefundReason(e.target.value)} rows={4} className="w-full border rounded px-3 py-2" placeholder="Describe the issue..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (optional)</label>
                <input type="number" min="0" value={refundAmount} onChange={e=>setRefundAmount(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="e.g., 999" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setRefundOpen(false)} className="px-3 py-2 rounded border">Cancel</button>
              <button
                disabled={refundSubmitting || !refundReason.trim()}
                onClick={async ()=>{
                  if (!refundReason.trim()) return;
                  setRefundSubmitting(true);
                  try {
                    const res = await fetch('/api/refunds', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ orderId: refundOrderId, reason: refundReason.trim(), amountRequested: refundAmount ? Number(refundAmount) : undefined })
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Failed to submit refund');
                    alert('Refund request submitted');
                    setRefundOpen(false);
                  } catch (e) {
                    alert(e.message || 'Failed to submit refund');
                  } finally {
                    setRefundSubmitting(false);
                  }
                }}
                className={`px-4 py-2 rounded ${refundReason.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              >{refundSubmitting ? 'Submitting...' : 'Submit Request'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
