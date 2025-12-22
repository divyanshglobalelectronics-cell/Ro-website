import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaShoppingCart,
  FaGlobe,
  FaShieldAlt,
  FaLink,
} from "react-icons/fa";

const THEME = "#0a4b78";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef5fb] via-white to-[#eef5fb] px-6 py-14">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

        {/* SIDEBAR */}
        <Sidebar />

        {/* CONTENT */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <InfoCard
            icon={<FaShoppingCart />}
            title="RO PRODUCTS"
            items={[
              { label: "Domestic RO Water Purifiers", path: "/products" },
              { label: "Commercial RO Plants", path: "/products" },
              { label: "Industrial RO Systems", path: "/products" },
              { label: "RO Membranes", path: "/products" },
              { label: "RO Filters & Candles", path: "/products" },
              { label: "RO Spare Parts", path: "/products" },
              { label: "RO Accessories", path: "/products" },
            ]}
          />

          <InfoCard
            icon={<FaGlobe />}
            title="DISCOVER US"
            items={[
              { label: "About Us", path: "/about" },
              { label: "Service Network", path: "/ServiceNetworkPage" },
              { label: "Blogs", path: "/blogs" },
              { label: "For Professionals", path: "/professionals" },
              { label: "Store Locator", path: "/store-locator" },
              { label: "Contact Us", path: "/contact" },
            ]}
          />

          <InfoCard
            icon={<FaShieldAlt />}
            title="POLICIES"
            items={[
              { label: "Cancellation & Returns", path: "/PrivacyPolicy" },
              { label: "Customer Grievance Policy", path: "/grievance-policy" },
              { label: "Privacy Policy", path: "/PrivacyPolicy" },
              { label: "Shipping Policy", path: "/shipping-policy" },
              { label: "Product Warranty Policy", path: "/TermsAndConditions" },
              { label: "Vendor Grievance Policy", path: "/TermsAndConditions" },
              { label: "Sitemap", path: "/sitemap" },
            ]}
          />

          <InfoCard
            icon={<FaLink />}
            title="IMPORTANT LINKS"
            items={[
              { label: "Support", path: "/HelpCenter" },
              { label: "Business", path: "/business" },
              { label: "Careers", path: "/Career" },
              { label: "Technology", path: "/technology" },
              { label: "Track Your Order", path: "/track-order" },
              { label: "Register Warranty Card", path: "/register-warranty" },
              { label: "Help Center", path: "/help" },
            ]}
          />

        </div>
      </div>
    </div>
  );
}

/* ================= SIDEBAR ================= */

function Sidebar() {
  const [open, setOpen] = useState(0);

  return (
    <div className="w-full lg:w-1/4 space-y-5">

      <Accordion
        title="Customer Policy"
        open={open === 0}
        onClick={() => setOpen(open === 0 ? null : 0)}
        items={[
          { label: "Customer Grievance Policy", path: "/CustomerGrievancePolicy" },
          { label: "Cancellations & Returns", path: "/PrivacyPolicy" },
          { label: "Privacy Policy", path: "/PrivacyPolicy" },
          { label: "Shipping Policy", path: "/TermsAndConditions" },
          { label: "Price Match Guarantee", path: "/PriceMatchGuarantee" },
        ]}
      />

      <Accordion
        title="Product Policy"
        open={open === 1}
        onClick={() => setOpen(open === 1 ? null : 1)}
        items={[
          { label: "Product Warranty Policy", path: "/ProductWarrantyPolicy" },
        ]}
      />

      <Accordion
        title="Vendor Policy"
        open={open === 2}
        onClick={() => setOpen(open === 2 ? null : 2)}
        items={[
          { label: "Vendor Grievance Policy", path: "/vendor-policy" },
          { label: "Purchase Order Conditions", path: "/purchase-order" },
          { label: "Procurement SOP", path: "/procurement-sop" },
        ]}
      />

      <StaticItem title="Investor Relations" path="/investor-relations" />
      {/* <StaticItem title="POSH" path="/posh-policy" /> */}
      <StaticItem title="Code of Conduct" path="/code-of-conduct" />

    </div>
  );
}

/* ================= ACCORDION ================= */

function Accordion({ title, items, open, onClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#0a4b7815] overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center px-5 py-4 font-semibold text-gray-800 hover:bg-[#0a4b7808]"
      >
        {title}
        {open ? <FaChevronDown /> : <FaChevronRight />}
      </button>

      {open && (
        <div className="px-6 pb-5 space-y-4 text-sm">
          {items.map((item, i) => (
            <HoverLink key={i} label={item.label} path={item.path} />
          ))}
        </div>
      )}
    </div>
  );
}

function StaticItem({ title, path }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#0a4b7815] px-5 py-4">
      <HoverLink label={title} path={path} />
    </div>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({ icon, title, items }) {
  return (
    <div className="relative bg-white/70 backdrop-blur rounded-3xl px-6 pt-16 pb-6 shadow-xl border border-[#0a4b7815]
                    transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* TOP GRADIENT BAR */}
      <div
        className="absolute top-0 left-0 w-full h-2 rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, ${THEME}, #0d6aa8)` }}
      />

      {/* ICON */}
      <div className="absolute -top-9 left-1/2 -translate-x-1/2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
             style={{ backgroundColor: THEME }}>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <span className="text-xl" style={{ color: THEME }}>{icon}</span>
          </div>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="text-gray-900 font-bold tracking-wider mt-4 text-center">
        {title}
      </h3>

      {/* DIVIDER */}
      <div className="w-12 h-1 mx-auto my-3 rounded-full" style={{ backgroundColor: THEME }} />

      {/* ITEMS */}
      <div className="text-sm text-gray-600 space-y-4">
        {items.map((item, i) => (
          <HoverLink key={i} label={item.label} path={item.path} />
        ))}
      </div>
    </div>
  );
}

/* ================= HOVER LINK (DOWN → UP EFFECT) ================= */

function HoverLink({ label, path }) {
  return (
    <Link to={path} className="group relative block overflow-hidden">
      <span
        className="block transform translate-y-1
                   group-hover:-translate-y-1
                   transition-all duration-300
                   group-hover:text-[#0a4b78]"
      >
        {label}
      </span>

      <span
        className="absolute left-0 bottom-0 w-full h-[1.5px]
                   bg-[#0a4b78]
                   scale-x-0 group-hover:scale-x-100
                   transition-transform duration-300 origin-left"
      />
    </Link>
  );
}