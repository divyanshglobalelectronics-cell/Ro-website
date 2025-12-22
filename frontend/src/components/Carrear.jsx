import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Career() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white pt-24 pb-20">
      
      {/* HERO SECTION */}
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          🌟 Career at <span className="text-[#4EA9FF]">Divyansh Global RO</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl leading-7 max-w-3xl mx-auto">
          Join us on a mission to deliver clean, safe and healthy drinking water to every home in India.
          If you are passionate about innovation, sustainability and creating impact — this is the right place for you!
        </p>

        <div className="mt-10 w-full bg-gradient-to-r from-[#1A2438] to-[#0E1628] rounded-xl shadow-xl p-6 backdrop-blur-xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">Why Work With Us?</h2>

          <ul className="text-gray-300 text-base space-y-2">
            <li>✔ Fast-growing water purification brand</li>
            <li>✔ Supportive and growth-oriented work culture</li>
            <li>✔ Opportunities in Sales, Service, Marketing, Admin & Technical fields</li>
            <li>✔ Training & career development for freshers and experienced professionals</li>
          </ul>
        </div>
      </div>

      {/* OPENINGS SECTION */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-3xl font-semibold mb-6 text-center">🚀 Current Openings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {[
            "Sales Executive",
            "Technician (RO Installation/Repair)",
            "Customer Support Executive",
            "Area Sales Manager",
            "Office Coordinator",
          ].map((role, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-[#4EA9FF]">{role}</h3>
              <p className="text-gray-300 text-sm mt-2">
                PAN India openings (Priority: Delhi-NCR, UP, Bihar, MP)
              </p>

              <button className="mt-4 w-full bg-gradient-to-r from-[#4EA9FF] to-[#0066FF] py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Apply Now
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="max-w-5xl mx-auto px-6 mt-20">
        <div className="bg-gradient-to-r from-[#1A2438] to-[#0E1628] rounded-2xl p-8 border border-white/10 shadow-xl backdrop-blur-xl">

          <h2 className="text-3xl font-semibold mb-4 text-center">📩 Interested in Joining?</h2>
          <p className="text-gray-300 text-center mb-8">
            Send your updated resume or reach out to us directly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-6">

            <div className="flex flex-col items-center">
              <FaEnvelope className="text-2xl text-[#4EA9FF]" />
              <p className="mt-2 text-gray-300 text-sm">divyanshglobalro@gmail.com</p>
            </div>

            <div className="flex flex-col items-center">
              <FaPhoneAlt className="text-2xl text-[#4EA9FF]" />
              <p className="mt-2 text-gray-300 text-sm">+91 89488 58489</p>
            </div>

            <div className="flex flex-col items-center">
              <FaMapMarkerAlt className="text-2xl text-[#4EA9FF]" />
              <p className="mt-2 text-gray-300 text-sm">PAN India</p>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM TAGLINE */}
      <h3 className="text-center text-gray-400 mt-10">
        Divyansh Global RO — Shuddh Pani, Swasth Jeevan 💧
      </h3>
    </div>
  );
}