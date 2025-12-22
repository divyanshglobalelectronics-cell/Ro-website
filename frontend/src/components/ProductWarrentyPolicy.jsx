import React from "react";
import { FaShieldAlt, FaTools, FaClipboardCheck, FaHeadset } from "react-icons/fa";

export default function ProductWarrantyPolicy() {
  return (
    <div className="w-full bg-[#f8fbfd] text-[#0b2545]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Product Warranty Policy
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Warranty coverage details for RO products purchased from DIVYANSH GLOBAL RO
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Warranty Assurance</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            At DIVYANSH GLOBAL RO, we stand behind the quality of our products. This Product Warranty Policy explains
            the warranty coverage, duration, exclusions, and the process to claim warranty services for RO systems
            and related components purchased from our website.
          </p>
        </div>

        {/* Warranty Coverage */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaClipboardCheck className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Warranty Coverage</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Warranty coverage varies by product and brand.</li>
            <li>• Manufacturing defects are covered under warranty.</li>
            <li>• Electrical and mechanical parts are covered as per manufacturer terms.</li>
            <li>• Warranty period starts from the date of installation or purchase invoice.</li>
            <li>• Original invoice is required for warranty claims.</li>
          </ul>
        </div>

        {/* Warranty Exclusions */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaTools className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Warranty Exclusions</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Damage due to improper installation or misuse.</li>
            <li>• Normal wear and tear of filters, membranes, and consumables.</li>
            <li>• Damage caused by voltage fluctuations or water quality issues.</li>
            <li>• Unauthorized repairs or modifications.</li>
            <li>• Physical damage caused by accidents or natural disasters.</li>
          </ul>
        </div>

        {/* Warranty Claim Process */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            Warranty Claim Process
          </h2>
          <ol className="space-y-2 text-sm md:text-base leading-relaxed list-decimal list-inside">
            <li>Contact our customer support team with product and invoice details.</li>
            <li>Describe the issue and share images or videos if required.</li>
            <li>Our team will verify the warranty eligibility.</li>
            <li>Approved claims will be repaired or replaced as per policy.</li>
            <li>Service timelines may vary depending on product availability.</li>
          </ol>
        </div>

        {/* Support */}
        <div className="bg-[#0b2545] text-white rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <FaHeadset className="text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Warranty Support</h2>
          </div>
          <p className="text-sm md:text-base mb-2">
            For warranty-related assistance, please reach out to our support team.
          </p>
          <p className="text-sm md:text-base">
            Email: <span className="font-medium">divyanshglobalro@gmail.com</span>
            <br />
            Phone: <span className="font-medium">+91-8948858489</span>
            <br />
            Business Hours: Monday to Saturday (10:00 AM – 6:00 PM)
          </p>
        </div>
      </div>
    </div>
  );
}