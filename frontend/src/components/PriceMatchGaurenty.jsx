import React from "react";
import { FaTag, FaRupeeSign, FaShieldAlt, FaHeadset } from "react-icons/fa";

export default function PriceMatchGuarantee() {
  return (
    <div className="w-full bg-[#f8fbfd] text-[#0b2545]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Price Match Guarantee
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Best prices assured on all RO products at DIVYANSH GLOBAL RO
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaTag className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Our Promise</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            At DIVYANSH GLOBAL RO, we are committed to offering high-quality RO products at the most competitive prices.
            If you find the same product at a lower price elsewhere, we promise to match it—because you deserve the best value for your money.
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaRupeeSign className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">How Price Match Works</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• The product must be identical (brand, model, specifications).</li>
            <li>• The lower price must be from a verified online or offline seller.</li>
            <li>• The product must be in stock and available for immediate purchase.</li>
            <li>• Share valid proof of the lower price (link, quotation, or screenshot).</li>
            <li>• Once verified, we will match the price or offer a suitable discount.</li>
          </ul>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Eligibility & Conditions</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Applicable only on brand-new products.</li>
            <li>• Excludes clearance sales, flash deals, and limited-time offers.</li>
            <li>• Price match requests must be made before placing the order.</li>
            <li>• Installation, shipping, and taxes may not be included in the match.</li>
            <li>• Final approval is subject to management discretion.</li>
          </ul>
        </div>

        {/* Support */}
        <div className="bg-[#0b2545] text-white rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <FaHeadset className="text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Request a Price Match</h2>
          </div>
          <p className="text-sm md:text-base mb-2">
            To request a price match, contact our support team with product details and proof of the lower price.
          </p>
          <p className="text-sm md:text-base">
            Email: <span className="font-medium">support@divyanshglobalro.com</span>
            <br />
            Phone: <span className="font-medium">+91-XXXXXXXXXX</span>
          </p>
        </div>
      </div>
    </div>
  );
}