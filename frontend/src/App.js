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
import AdminLogsPage from './pages/AdminLogsPage.jsx';
import GodModePlusPlus from './common/GodModePlusPlus.js';
import ScrollToTop from './common/ScrollToTop.jsx';
import PaymentStatus from './pages/PaymentStatus.jsx';
import Invoice from './pages/Invoice.jsx';
import ROInstallation from './components/ROInstallation.jsx';
import Faqs from "./pages/Faqs.jsx";
import TermsAndConditions from "./components/Terms&Conditions.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import BillingShippingPolicy from "./components/Billing&Shipping.jsx";
import CookiePolicy from "./components/CokkiePolicy.jsx";
import Career from "./components/Carrear.jsx";
import HelpCenter from "./components/HelpCenter.jsx";
import Disclaimer from "./components/Disclaimer.jsx";
import SiteMap from "./components/SiteMap.jsx";
import PriceMatchGuarantee from "./components/PriceMatchGaurenty.jsx";
import CustomerGrievancePolicy from "./components/CustomerGraviancePolicy.jsx";
import ProductWarrantyPolicy from "./components/ProductWarrentyPolicy.jsx";
import RoUninstallation from "./pages/RoUninstallation.jsx";
import AMCPlans from "./pages/AMCPlans.jsx";
import RoRepairMaintenance from "./pages/RoRepairMaintenance.jsx";
import OurTechnicians from "./pages/OurTechnicians.jsx";
import ServiceNetwork from "./pages/ServiceNetworkPage.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";
import ProfessionalsPage from "./pages/ProfessionalsPage.jsx";
import StoreLocatorPage from "./pages/StoreLocatorPage.jsx";
import BusinessPage from "./pages/BusinessPage.jsx";
import TechnologyPage from "./pages/TechnologyPage.jsx";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";
import RegisterWarrantyPage from "./pages/RegisterWarrantyPage.jsx";
import VendorPolicyPage from "./pages/VendorPolicyPage.jsx";
import PurchaseOrderPage from "./pages/PurchaseOrderPage.jsx";
import ProcurementSOPPage from "./pages/ProcurementSOPPage.jsx";
import InvestorRelationsPage from "./pages/InvestorRelationsPage.jsx";
import CodeOfConductPage from "./pages/CodeOfConductPage.jsx";
import ReturnRefundPolicyPage from "./pages/ReturnRefundPolicyPage.jsx";


function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GodModePlusPlus/>
        <ScrollToTop />
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
            <Route path='/faqs' element={<Faqs/>}/>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/BillingShippingPolicy" element={<BillingShippingPolicy />} />
            <Route path="/CookiePolicy" element={<CookiePolicy />} />
            <Route path="/Career" element={<Career />} />
            <Route path="/HelpCenter" element={<HelpCenter />} />
            <Route path="/Disclaimer" element={<Disclaimer />} />
            {/* Aliases to match existing links in SiteMap */}
            <Route path="/grievance-policy" element={<CustomerGrievancePolicy />} />
            <Route path="/shipping-policy" element={<BillingShippingPolicy />} />
            <Route path="/returns-policy" element={<ReturnRefundPolicyPage />} />
            <Route path="/RefundPolicy" element={<ReturnRefundPolicyPage />} />
            {/* Footer Services */}
            <Route path="/ro-uninstallation" element={<RoUninstallation />} />
            <Route path="/AMCplan" element={<AMCPlans />} />
            <Route path="/ro-repair" element={<RoRepairMaintenance />} />
            <Route path="/ourtechnicians" element={<OurTechnicians />} />

            {/* Policies and Info */}
            <Route path="/ReturnRefundPolicy" element={<ReturnRefundPolicyPage />} />
            <Route path="/vendor-policy" element={<VendorPolicyPage />} />
            <Route path="/purchase-order" element={<PurchaseOrderPage />} />
            <Route path="/procurement-sop" element={<ProcurementSOPPage />} />

            {/* Discover / Sitemap sections */}
            <Route path="/ServiceNetworkPage" element={<ServiceNetwork />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/professionals" element={<ProfessionalsPage />} />
            <Route path="/store-locator" element={<StoreLocatorPage />} />

            {/* Important Links */}
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/register-warranty" element={<RegisterWarrantyPage />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/investor-relations" element={<InvestorRelationsPage />} />
            <Route path="/code-of-conduct" element={<CodeOfConductPage />} />
            <Route path="/PriceMatchGuarantee" element={<PriceMatchGuarantee />} />
            <Route path="/CustomerGrievancePolicy" element={<CustomerGrievancePolicy />} />
            <Route path="/ProductWarrantyPolicy" element={<ProductWarrantyPolicy />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/admin-products" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/logs" element={<AdminLogsPage />} />
            <Route path="/sitemap" element={<SiteMap />} />
          </Routes>
        </main>
        <Footer />
    </div>
  );
}

export default App;
