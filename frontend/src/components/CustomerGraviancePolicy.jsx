import React from "react";
import { FaUserShield, FaClipboardList, FaClock, FaHeadset } from "react-icons/fa";

export default function CustomerGrievancePolicy() {
  return (
    <div className="w-full bg-[#f8fbfd] text-[#0b2545]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Customer Grievance Policy
          </h1>
          <p className="text-sm md:text-base opacity-90">
            We are committed to resolving your concerns fairly, promptly, and transparently
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaUserShield className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Our Commitment</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            At DIVYANSH GLOBAL RO, customer satisfaction is our top priority. This Customer Grievance Policy outlines
            the process for raising concerns, complaints, or feedback regarding our products and services.
            We ensure that every grievance is handled with care, fairness, and confidentiality.
          </p>
        </div>

        {/* Types of Grievances */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaClipboardList className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Types of Grievances Covered</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Product quality or performance issues</li>
            <li>• Billing, payment, or refund-related concerns</li>
            <li>• Shipping delays or damaged products</li>
            <li>• Installation or service-related complaints</li>
            <li>• Customer support experience</li>
          </ul>
        </div>

        {/* Grievance Redressal Process */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaClock className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Grievance Redressal Process</h2>
          </div>
          <ol className="space-y-2 text-sm md:text-base leading-relaxed list-decimal list-inside">
            <li>Submit your grievance via email or phone with complete details.</li>
            <li>Our support team will acknowledge your complaint within 24–48 hours.</li>
            <li>The issue will be reviewed and investigated by the concerned department.</li>
            <li>A resolution will be provided within 7–10 business days.</li>
            <li>If required, the grievance may be escalated for further review.</li>
          </ol>
        </div>

        {/* Escalation */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            Escalation Matrix
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            If you are not satisfied with the initial resolution, you may request an escalation.
            Escalated grievances will be reviewed by senior management to ensure a fair outcome.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#0b2545] text-white rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <FaHeadset className="text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Grievance Contact Details</h2>
          </div>
          <p className="text-sm md:text-base mb-2">
            To raise a grievance, please contact us using the details below:
          </p>
          <p className="text-sm md:text-base">
            Email: <span className="font-medium">support@divyanshglobalro.com</span>
            <br />
            Phone: <span className="font-medium">+91-XXXXXXXXXX</span>
            <br />
            Business Hours: Monday to Saturday (10:00 AM – 6:00 PM)
          </p>
        </div>
      </div>
    </div>
  );
}