import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-black text-gray-300 pt-28 pb-16 overflow-hidden">

      {/* === RGB BORDER CORE === */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border-transparent animate-rgb-border"></div>
      </div>

      {/* === 3D NEON GRID FLOOR === */}
      <div className="absolute bottom-0 left-0 w-full h-40 opacity-20 pointer-events-none neon-grid"></div>

      {/* === CURSOR GLOW FIELD (auto, no JS) === */}
      <div className="absolute inset-0 radial-mask pointer-events-none"></div>

      {/* === FLOATING PARTICLES === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* BRAND */}
          <div className="space-y-4 group">
            <div className="flex items-center gap-4">
              <div className="neon-logo group-hover:scale-110 transition">
                💧
              </div>
              <h3 className="god-title">Divyansh Global RO</h3>
            </div>
            <p className="god-desc">
              Healthy Water, Healthy You. Pure water purification solutions
              trusted by thousands with 24/7 service support.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="god-heading">Quick Links</h4>
            <ul className="god-list">
              <li><Link className="god-link" to="/">🏠 Home</Link></li>
              <li><Link className="god-link" to="/products">💧 Products</Link></li>
              <li><Link className="god-link" to="/contact">📞 Contact</Link></li>
              <li><Link className="god-link" to="/about">❓ About Us</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="god-heading">Support & Services</h4>
            <ul className="god-list">
              <li><a className="god-link" href="mailto:Divyanshglobalroservice@gmail.com">📧 Email Support</a></li>
              <li><a className="god-link" href="tel:+91XXXXXXXXXX">📞 Call Us</a></li>
              <li><Link className="god-link" to="/contact?service=RO Repair">🔧 RO Repair</Link></li>
              <li><Link className="god-link" to="/contact?service=RO AMC Plans">📋 AMC Plans</Link></li>
            </ul>
          </div>

          {/* WHATSAPP CTA */}
          <div className="space-y-4">
            <h4 className="god-heading">Exclusive Offer</h4>
            <p className="god-desc">Get 20% OFF your first service! Instant WhatsApp support available.</p>

            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              className="god-button"
            >
              💬 WhatsApp Now
            </a>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Divyansh Global RO Service. All rights reserved.</p>
          <p>Built with ❤️ for clean water</p>
        </div>
      </div>
    </footer>
  );
}
