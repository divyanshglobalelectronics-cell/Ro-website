import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();
  const { user, logout } = useAuth();
  const count = items.reduce((n, it) => n + it.quantity, 0);

  const navItem = ({ to, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-blue-700' : 'text-white hover:text-blue-600'}`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header className="bg-gradient-to-tr from-[#210328] to-[#410548] border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-800 rounded-full shadow-md flex items-center justify-center text-2xl text-white font-bold">💧</div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:inline">Divyansh Global RO</span>
        </Link>
        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded p-2 text-gray-700 hover:bg-gray-100 transition"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5'} />
          </svg>
        </button>
        <nav className="hidden md:flex items-center gap-1 text-white">
          {navItem({ to: '/', label: '🏠 Home' })}
          {navItem({ to: '/products', label: '💧 Products' })}


          {/* Services dropdown */}
          <div className="relative group">
            <button type="button" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-blue-700 hover:bg-blue-50 transition focus:outline-none">
              🔧 Services <FiChevronDown className="mt-0.5" />
            </button>
            <div className="absolute left-0 top-full z-50 hidden group-hover:block group-focus-within:block bg-white shadow-xl rounded-xl p-4 w-64 border border-gray-200">
              <ul className="space-y-1 text-sm">
                <li><Link className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700" to="/ro-installation">📦 RO Installation</Link></li>
                <li><Link className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700" to="/faqs">📦 FAQS</Link></li>
              </ul>
            </div>
          </div>

          {navItem({ to: '/about', label: 'AboutUs' })}
          {user && user.isAdmin && navItem({ to: '/admin', label: 'Admin' })}
          {navItem({ to: '/contact', label: 'Contact' })}
          {user ? (
            <div className="relative group">
              <button type="button" aria-label="My Account" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none">
                <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`} alt='' className='rounded-full h-[30px] w-[30px] hover:animate-rotateYoyo'/>
              </button>
              <div className="absolute right-0 top-full z-50 hidden group-hover:block group-focus-within:block bg-white shadow-xl rounded-xl p-3 w-48 border border-gray-200">
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link to="/profile" className="block px-3 py-2 text-black rounded-lg hover:bg-blue-50">👤 Profile</Link>
                  </li>
                  <li>
                    <Link to="/orders" className="block px-3 py-2 text-black rounded-lg hover:bg-blue-50">📦 My Orders</Link>
                  </li>
                  <li className="border-t pt-1">
                    <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium">🚪 Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {navItem({ to: '/login', label: ' Login' })}
              {navItem({ to: '/signup', label: ' Sign up' })}
            </>
          )}
          {user && (
            <div className="relative ml-2">
              <Link to="/cart" className="inline-flex items-center gap-1 px-4 py-2 hover:animate-rotateYoyo bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold shadow-md transition">
                🛒 Cart
                {count > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold bg-red-500 rounded-full">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 px-3 text-gray-800 hover:bg-blue-50 rounded-lg font-medium">🏠 Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 px-3 text-gray-800 hover:bg-blue-50 rounded-lg font-medium">💧 Products</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-2 px-3 text-gray-800 hover:bg-blue-50 rounded-lg font-medium">📞 Contact</Link>
            {user && (
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2 px-3 text-gray-800 hover:bg-blue-50 rounded-lg font-medium">🛒 Cart ({count})</Link>
            )}
            {user ? (
              <div className="pt-3 border-t border-gray-200 mt-3">
                <div className="text-xs uppercase text-gray-500 mb-3 font-bold">My Account</div>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 px-3 text-gray-800 hover:bg-blue-50 rounded-lg">👤 Profile</Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="block py-2 px-3 text-gray-800 hover:bg-blue-50 rounded-lg">📦 My Orders</Link>
                <button onClick={() => { setMobileOpen(false); logout(); }} className="block py-2 px-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg font-medium">🚪 Logout</button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-200 mt-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 px-3 text-gray-800 hover:bg-blue-50 rounded-lg font-medium">🔐 Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="block py-2 px-3 text-gray-800 hover:bg-blue-50 rounded-lg font-medium">✍️ Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
