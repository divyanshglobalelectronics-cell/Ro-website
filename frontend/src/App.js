import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from '../src/common/Header.jsx';
import Footer from '../src/common/Footer.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from '../src/components/product&payment/ProductDetail.jsx';
import Cart from '../src/components/product&payment/Cart.jsx';
import Checkout from '../src/components/product&payment/Checkout.jsx';
import Payment from '../src/components/product&payment/Payment.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import AboutUs from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from '../src/components/ForgotPassword.jsx';
import ResetPassword from '../src/components/ResetPassword.jsx';
import MyOrders from '../src/components/proflie/MyOrders.jsx';
import Profile from './components/proflie/Profile.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import GodModePlusPlus from './common/GodModePlusPlus.js';
import PaymentStatus from './pages/PaymentStatus.jsx';
import Invoice from './pages/Invoice.jsx';
import ROInstallation from './components/ROInstallation.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GodModePlusPlus/>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/ro-installation" element={<ROInstallation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/admin-products" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
    </div>
  );
}

export default App;
