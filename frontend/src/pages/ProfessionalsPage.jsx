import React from "react";
import { FaUserTie, FaTools, FaHandshake, FaHeadset } from "react-icons/fa";

export default function ForProfessionals() {
  return (
    <div className="w-full bg-[#f8fbfd] text-[#0b2545]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            For Professionals
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Tailored RO solutions and partnerships for professionals & businesses
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaUserTie className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Who This Is For</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            DIVYANSH GLOBAL RO offers specialized water purification solutions for professionals including
            builders, architects, facility managers, hospitals, hotels, factories, offices, and service providers.
            We understand professional requirements and deliver reliable, scalable, and cost-effective RO systems.
          </p>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaTools className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Professional Solutions</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Commercial & Industrial RO systems</li>
            <li>• Custom-designed water purification plants</li>
            <li>• AMC & maintenance contracts</li>
            <li>• Bulk supply of RO components & spare parts</li>
            <li>• On-site installation and technical support</li>
          </ul>
        </div>

        {/* Partnership */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaHandshake className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Partnership Opportunities</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            We collaborate with professionals, contractors, and resellers to deliver high-quality water solutions.
            Our partnership programs offer competitive pricing, technical training, and dedicated support to help
            you grow your business with confidence.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">Why Choose DIVYANSH GLOBAL RO</h2>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Industry experience and technical expertise</li>
            <li>• Customized solutions for professional needs</li>
            <li>• Reliable after-sales service and support</li>
            <li>• Transparent pricing and long-term value</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-[#0b2545] text-white rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <FaHeadset className="text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Get in Touch</h2>
          </div>
          <p className="text-sm md:text-base mb-2">
            For professional inquiries, bulk orders, or partnerships, contact us:
          </p>
          <p className="text-sm md:text-base">
            Email: <span className="font-medium">business@divyanshglobalro.com</span>
            <br />
            Phone: <span className="font-medium">+91-XXXXXXXXXX</span>
          </p>
        </div>
      </div>
    </div>
  );
}