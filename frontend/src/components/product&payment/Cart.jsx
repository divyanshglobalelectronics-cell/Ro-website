import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  // console.log("cart items",items);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-gray-600">Let's explore some amazing water purifiers!</p>
          <Link to="/products" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#484b8b] to-[#1b083a] py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900">🛒 Shopping Cart</h1>
        
        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.slug} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4">
                <img src={it.image || 'https://via.placeholder.com/100x80?text=RO'} alt={it.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg">{it.title}</div>
                  {/* <div>{it.description}</div> */}
                  <div className="mt-1 text-2xl font-bold text-blue-600">₹ {it.price.toLocaleString('en-IN')}</div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <button onClick={() => updateQuantity(it.slug, Math.max(1, it.quantity - 1))} className="px-3 py-1 bg-white rounded hover:bg-gray-100 font-bold">−</button>
                  <input type="number" min="1" value={it.quantity} onChange={(e) => updateQuantity(it.slug, Number(e.target.value) || 1)} className="w-12 border border-gray-300 rounded px-2 py-1 text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => updateQuantity(it.slug, it.quantity + 1)} className="px-3 py-1 bg-white rounded hover:bg-gray-100 font-bold">+</button>
                </div>
                <div className="text-right min-w-fit">
                  <div className="text-sm text-gray-600">Subtotal</div>
                  <div className="text-xl font-bold text-gray-900">₹ {(it.price * it.quantity).toLocaleString('en-IN')}</div>
                  <button onClick={() => removeFromCart(it.slug)} className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="mb-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full block px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition-all text-center mb-3">
                Proceed to Checkout
              </Link>

              <button onClick={clearCart} className="w-full px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                Clear Cart
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link to="/products" className="text-blue-600 hover:underline text-sm font-medium">← Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
