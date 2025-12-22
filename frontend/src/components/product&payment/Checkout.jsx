import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Loader from '../../common/Loader.jsx';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, token: authToken } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });

  useEffect(() => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent('/checkout')}`);
    }
  }, [user, navigate]);


  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    // Navigate to payment page with customer data
    navigate('/payment', { state: { customer } });
  };

  if (loading) return <Loader label="Placing your order..." />;
  // console.log("checkout items",items);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#484b8b] to-[#1b083a] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Checkout</h1>
          <p className="mt-2 text-white">Complete your purchase securely</p>
        </div>

        {error && <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">✗ {error}</div>}

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={placeOrder} className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none" required rows={3} value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={customer.pincode} onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })} />
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md disabled:opacity-60 transition-all">
                {loading ? '⏳ Processing...' : '💳 Proceed to Payment'}
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
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
