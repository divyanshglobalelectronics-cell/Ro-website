import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Loader from '../../common/Loader.jsx';
import { apiPost } from '../../api/client.js';

export default function Payment() {
  const { items, subtotal, clearCart } = useCart();
  const { user, token: authToken } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const customer = location.state?.customer || {};

  useEffect(() => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent('/checkout')}`);
    }
    if (!location.state?.customer) {
      navigate('/checkout');
    }
  }, [user, navigate, location.state]);

  const processPayment = async (e) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    setLoading(true);
    try {
      // 1) Create order on our backend
      const order = await apiPost('/api/orders', {
        items: items.map((it) => ({ product: it.productId, title: it.title, price: it.price, quantity: it.quantity, description: it.description })),
        customer,
        paymentMethod,
        notes: '',
      }, authToken);

      // 3) Initiate PayU (non-COD only)
      const init = await apiPost('/api/payments/payu/initiate', {
        amount: subtotal,
        productinfo: `Order ${order._id}`,
        firstname: customer.name,
        email: customer.email || 'noemail@example.com',
        phone: customer.phone,
        orderId: order._id,
      });

      // 4) Auto-submit form to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = init.action;
      Object.entries(init.params || {}).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      setError(e.message || 'Failed to process payment');
      showToast(e.message || 'Failed to process payment', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Processing your payment..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#484b8b] to-[#1b083a] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Payment</h1>
          <p className="mt-2 text-white">Review your order and complete payment</p>
        </div>

        {error && <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">✗ {error}</div>}

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={processPayment} className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Options</h2>

            {/* Delivery Address Summary */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Delivery Address</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div><span className="font-semibold">Name:</span> {customer.name}</div>
                <div><span className="font-semibold">Phone:</span> {customer.phone}</div>
                <div><span className="font-semibold">Address:</span> {customer.address}</div>
                <div><span className="font-semibold">City:</span> {customer.city}</div>
                <div><span className="font-semibold">Pincode:</span> {customer.pincode}</div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/checkout', { state: { customer } })}
                className="mt-3 text-sm text-blue-600 hover:underline font-medium"
              >
                ✏️ Edit Address
              </button>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setPaymentMethod('upi')}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                <label className="ml-3 cursor-pointer flex-1">
                  <div className="font-semibold text-gray-900">UPI</div>
                  <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</div>
                </label>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setPaymentMethod('card')}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                <label className="ml-3 cursor-pointer flex-1">
                  <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, RuPay</div>
                </label>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setPaymentMethod('netbanking')}>
                <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                <label className="ml-3 cursor-pointer flex-1">
                  <div className="font-semibold text-gray-900">Net Banking</div>
                  <div className="text-sm text-gray-600">All major banks</div>
                </label>
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg shadow-md disabled:opacity-60 transition-all">
                {loading ? '⏳ Processing...' : `💳 Pay ₹ ${subtotal.toLocaleString('en-IN')}`}
              </button>
              <button
                type="button"
                onClick={() => navigate('/checkout', { state: { customer } })}
                className="w-full mt-3 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                ← Back to Checkout
              </button>
            </div>
          </form>

          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {items.map((it) => (
                  <div key={it.slug} className="flex justify-between text-sm">
                    <span className="text-gray-700">{it.title} <span className="text-gray-500">× {it.quantity}</span></span>
                    <span className="font-medium text-gray-900">₹ {(it.price * it.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
