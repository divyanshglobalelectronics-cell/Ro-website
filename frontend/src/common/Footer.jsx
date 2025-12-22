import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";


import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="w-full text-white pt-20 pb-0"
      style={{ backgroundColor: "#072F53" }}
    >
      {/* ================= MAIN FOUR COLUMNS ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-6 pb-12">

        {/* BRAND SECTION */}
        <div>
          <h2
            className="text-xl font-bold tracking-wide mb-3"
            style={{ color: "#6EC1E4" }}
          >
            RO SERVICE HUB
          </h2>

          <p className="text-lg leading-6" style={{ color: "#DCE6EF" }}>
            Premium RO Installation, Repair & AMC Services for homes & offices.
            Your trusted water purifier partner.
          </p>

          <p className="text-sm mt-4" style={{ color: "#EAF7FC" }}>
            © 2025 Divyansh Global IT Pvt. Ltd.
          </p>
        </div>

        {/* SERVICES */}
        <div>
          <h3
            className="font-semibold mb-4 text-xl uppercase"
            style={{ color: "#6EC1E4" }}
          >
            Services
          </h3>

          <ul className="space-y-3 text-xl">
            {[
              { label: "RO Installation", link: "/ro-installation" },
              { label: "RO Uninstallation", link: "/ro-uninstallation" },
              { label: "AMC Plans", link: "/AMCplan" },
              { label: "RO Repair & Maintenance", link: "/ro-repair" },
              { label: "Our Technicians", link: "/ourtechnicians" },
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className="hover:text-white transition"
                  style={{ color: "#DCE6EF" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        

        {/* BUY NOW */}
        <div>
          <h3
            className="font-semibold mb-4 text-xl uppercase"
            style={{ color: "#6EC1E4" }}
          >
            Buy Now
          </h3>

          <ul className="space-y-3 text-xl">
            <li>
              <Link
                className="hover:text-white transition"
                style={{ color: "#DCE6EF" }}
                to="/TermsAndConditions"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition"
                style={{ color: "#DCE6EF" }}
                to="/PrivacyPolicy"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition"
                style={{ color: "#DCE6EF" }}
                to="/ReturnRefundPolicy"
              >
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition"
                style={{ color: "#DCE6EF" }}
                to="/BillingShippingPolicy"
              >
                Billing & Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white transition"
                style={{ color: "#DCE6EF" }}
                to="/CookiePolicy"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3
            className="font-semibold mb-4 text-xl uppercase"
            style={{ color: "#6EC1E4" }}
          >
            Support
          </h3>

          <ul className="space-y-3 text-xl">
            <li>
              <Link
                to="/Career"
                className="hover:text-white transition"
                style={{ color: "#DCE6EF" }}
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                to="/HelpCenter"
                className="hover:text-white transition"
                style={{ color: "#DCE6EF" }}
              >
                Help center
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ================= DIVIDER LINE ================= */}
      <div
        className="w-full border-t mb-10"
        style={{ borderColor: "#6EC1E4" }}
      ></div>

      

      {/* ================= PAYMENT + SOCIAL ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6 pb-10">

        {/* PAYMENT METHODS */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Payment Methods</h3>

          <div className="flex flex-wrap items-center gap-4">
            {["https://th.bing.com/th/id/OIP.FtvETY1E_WFX9yKpZ057BwHaE1?w=283&h=185&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1", "https://th.bing.com/th/id/OIP.ygZGQKeZ0aBwHS7e7wbJVgHaDA?w=332&h=142&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1", "https://th.bing.com/th/id/OIP.oThfNl_HRn7S8vKzxowd8AHaCm?w=329&h=123&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1", "https://th.bing.com/th/id/OIP.5fsr0lIr80fl7zyC-T2FTgHaEo?w=248&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.2&pid=1.7&rm=3&ucfimg=1"].map((img,index) => (
              <img
                key={img}
                src={img}
                className="w-12 h-8 p-1 rounded-md shadow bg-white"
                alt={index}
              />
            ))}
          </div>
        </div>

        {/* FOLLOW US */}
        <div className="md:text-right">
          <h3 className="font-semibold text-xl mb-4">Follow Us</h3>

          <div className="flex md:justify-end gap-4">
            {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaWhatsapp].map(
              (Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow hover:scale-110 transition"
                >
                  <Icon className="text-xl" style={{ color: "#072F53" }} />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM COPYRIGHT ================= */}
      <div className="w-full border-t pb-6"
        style={{ borderColor: "#6EC1E4" }}
      >
        <div
          className="max-w-7xl mx-auto px-6 mt-6 flex flex-col md:flex-row justify-between items-center text-sm"
          style={{ color: "#EAF7FC" }}
        >
          <p>Copyright © 2025. All rights reserved.</p>

          <div className="flex gap-4 mt-3 md:mt-0">
            <Link to="/PrivacyPolicy" className="hover:text-white">Privacy Policy</Link>
            <span>|</span>
            <Link to="/Disclaimer" className="hover:text-white">Disclaimer</Link>
            <span>|</span>
            <Link to="/sitemap" className="hover:text-white">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}