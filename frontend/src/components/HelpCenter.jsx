import React from "react";
import {
  FaTools,
  FaWrench,
  FaFileInvoice,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaHeadset,
} from "react-icons/fa";

const THEME_BG = "#0B3558";     // dark blue (footer theme)
const THEME_ACCENT = "#4FC3F7"; // light blue accent

export default function HelpCenter() {
  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* HEADER */}
      <div
        className="py-16 px-6 text-center text-white"
        style={{ backgroundColor: THEME_BG }}
      >
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="max-w-3xl mx-auto text-lg opacity-90">
          Welcome to the Help Center of <strong>DIVYANSH GLOBAL RO</strong>.
          We’re here to support you with installation, repair, AMC, warranty,
          and service-related queries.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

        <HelpCard
          icon={<FaTools />}
          title="RO Installation Support"
          desc="Get expert assistance for new RO installation at your home or office by trained professionals."
        />

        <HelpCard
          icon={<FaWrench />}
          title="Repair & Maintenance"
          desc="Facing water flow issues, leakage, or bad taste? We help arrange quick and reliable repairs."
        />

        <HelpCard
          icon={<FaShieldAlt />}
          title="AMC Plans & Warranty"
          desc="Get complete details about AMC plans, warranty coverage, and service benefits."
        />

        <HelpCard
          icon={<FaFileInvoice />}
          title="Billing & Payments"
          desc="Support for invoices, service charges, AMC payments, and billing-related queries."
        />

        <HelpCard
          icon={<FaMapMarkerAlt />}
          title="Service Availability"
          desc="Check RO service availability in your area and expected service timelines."
        />

        <HelpCard
          icon={<FaHeadset />}
          title="Customer Support"
          desc="Need help urgently? Our support team is ready to assist you during working hours."
        />

      </div>

      {/* CTA */}
      <div
        className="py-14 text-center text-white"
        style={{ backgroundColor: THEME_BG }}
      >
        <h2 className="text-2xl font-semibold mb-4">
          Still Need Help?
        </h2>
        <p className="mb-6 opacity-90">
          Contact our support team or book a service request for quick assistance.
        </p>
        <button
          className="px-8 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition"
          style={{ backgroundColor: THEME_ACCENT, color: THEME_BG }}
        >
          Book a Service
        </button>
      </div>

    </div>
  );
}

/* ---------------- HELP CARD ---------------- */

function HelpCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition border border-gray-100">
      <div
        className="w-14 h-14 flex items-center justify-center rounded-full text-2xl mb-5"
        style={{ backgroundColor: "#E3F2FD", color: "#0B3558" }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}