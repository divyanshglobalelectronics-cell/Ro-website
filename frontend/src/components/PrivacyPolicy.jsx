import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Title = ({ children }) => (
  <h2 className="text-2xl font-semibold text-black flex items-center gap-2 mb-4">
    <FaCheckCircle className="text-[#6EC1E4]" />
    {children}
  </h2>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto border border-[#DCE6EF]">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-black tracking-wide">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Your privacy and trust are important to us at DIVYANSH GLOBAL RO.
          </p>
          <div className="w-24 h-1 bg-[#6EC1E4] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* CONTENT */}
        <div className="space-y-10">

          {/* INTRODUCTION */}
          <div className="p-2 rounded-2xl">
            <p className="text-gray-700 leading-relaxed">
              At <strong>DIVYANSH GLOBAL RO</strong>, we deeply respect and value your privacy.
              We are committed to protecting the personal information of all our website visitors,
              customers, and users. This Privacy Policy explains how your information is collected,
              used, and protected when you interact with our website or services.
            </p>
          </div>

          {/* 1. Use of Personal Information */}
          <div className="p-2 rounded-2xl">
            <Title>1. Use of Personal Information</Title>
            <p className="text-gray-700 leading-relaxed">
              We do not share, sell, or disclose your personal information to any third party,
              unless required by law, legal process, or for safety/security purposes. Your
              personal data is used only for communication, order processing, support services,
              or other purposes that you have agreed to.
            </p>
          </div>

          {/* 2. Information Collection */}
          <div className="p-2 rounded-2xl">
            <Title>2. Information We Collect</Title>
            <p className="text-gray-700 leading-relaxed">
              When you visit our website, contact us, or make a purchase, you may be asked to
              provide personal information. At the time of collection, we will clearly inform you:
            </p>

            <ul className="text-gray-700 leading-relaxed list-disc pl-6 mt-3 space-y-2">
              <li>What information is being collected</li>
              <li>Why it is being collected</li>
              <li>Your right to access, update, or request deletion of your information</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-4">
              Personal information may include your name, phone number, email address, address,
              payment details, and service-related details.
            </p>
          </div>

          {/* 3. Security & Protection */}
          <div className="p-2 rounded-2xl">
            <Title>3. Security & Protection</Title>
            <p className="text-gray-700 leading-relaxed">
              All data you provide is securely stored and handled with the highest level of
              confidentiality. We implement strong security practices to protect your information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              However, while we follow industry-standard security measures, no online data
              transmission can be guaranteed 100% secure.
            </p>
          </div>

          {/* 4. Policy Updates */}
          <div className="p-2 rounded-2xl">
            <Title>4. Policy Updates</Title>
            <p className="text-gray-700 leading-relaxed">
              By using our website, you agree to this Privacy Policy. We reserve the right to
              update or modify any part of this policy at any time. Any changes will be posted on
              this page. Continued use of the site after such updates signifies your acceptance
              of the updated Privacy Policy.
            </p>
          </div>

          {/* ADDRESS */}
          <div className="p-2 rounded-2xl bg-[#EAF7FF]">
            <h3 className="text-2xl font-bold text-[#0C62AB] mb-3">Our Address</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>DIVYANSH GLOBAL ELECTRONIC BAZAR</strong> <br />
              Gaur City Center, 7th Floor, Office No. O775,<br />
              Greater Noida W Rd, Near 4 Murti,<br />
              Gaur City 1, Sector 4, Greater Noida,<br />
              Ghaziabad, Uttar Pradesh – 201301<br /><br />
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

