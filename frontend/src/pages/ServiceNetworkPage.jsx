import React from "react";
import {
  FaTools,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaCheckCircle,
  FaUsers,
  FaIndustry,
} from "react-icons/fa";

const THEME = "#0a4b78";

export default function ServiceNetworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef5fb] via-white to-[#eef5fb]">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Our Service Network
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          DIVYANSH GLOBAL RO delivers reliable installation, maintenance, and
          after-sales support through a strong and growing service network.
        </p>
      </section>

      {/* OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        <FeatureCard
          icon={<FaTools />}
          title="Expert Installation"
          text="Professional installation for domestic, commercial, and industrial RO systems."
        />
        <FeatureCard
          icon={<FaMapMarkedAlt />}
          title="Wide Coverage"
          text="Service partners across cities, towns, and industrial zones."
        />
        <FeatureCard
          icon={<FaCheckCircle />}
          title="Trusted Support"
          text="Genuine spare parts and trained service engineers."
        />
      </section>

      {/* SERVICES */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Services We Offer
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <ServiceCard title="Installation" items={[
              "Domestic RO Systems",
              "Commercial RO Plants",
              "Industrial RO Units",
            ]} />

            <ServiceCard title="Repair & Support" items={[
              "RO Troubleshooting",
              "Leakage & TDS Issues",
              "Electrical & Pump Repairs",
            ]} />

            <ServiceCard title="Maintenance & AMC" items={[
              "Periodic Servicing",
              "Filter Replacement",
              "Annual Maintenance Contracts",
            ]} />

            <ServiceCard title="Spare Parts" items={[
              "RO Membranes",
              "Filters & Candles",
              "Pumps & Controllers",
            ]} />
          </div>
        </div>
      </section>

      {/* INDUSTRIAL SUPPORT */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Commercial & Industrial Support
          </h2>
          <p className="text-gray-600 mb-6">
            Our specialized teams handle large-scale RO plants with precision,
            ensuring high performance, compliance, and minimal downtime.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li>✔ High-capacity RO systems</li>
            <li>✔ Scheduled servicing</li>
            <li>✔ Technical compliance</li>
            <li>✔ Long-term system efficiency</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10 border border-[#0a4b7815]">
          <FaIndustry className="text-5xl mb-4" style={{ color: THEME }} />
          <h3 className="text-xl font-semibold mb-2">Enterprise Solutions</h3>
          <p className="text-gray-600">
            Tailored RO solutions for factories, hospitals, hotels, and
            institutions.
          </p>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-[#0a4b78] py-20 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Need Service Assistance?</h2>
        <p className="mb-8 text-white/90">
          Our service team is ready to help you with installation, servicing, or
          technical support.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <ActionButton icon={<FaPhoneAlt />} text="Contact Support" />
          <ActionButton icon={<FaUsers />} text="Become a Service Partner" />
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-[#0a4b7815]
                    hover:-translate-y-2 transition duration-300">
      <div className="text-4xl mb-4" style={{ color: THEME }}>{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}

function ServiceCard({ title, items }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-3xl p-8 shadow-lg border border-[#0a4b7815]
                    hover:-translate-y-2 transition duration-300">
      <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function ActionButton({ icon, text }) {
  return (
    <button className="flex items-center gap-3 bg-white text-[#0a4b78]
                       px-6 py-3 rounded-full font-semibold
                       hover:bg-[#eef5fb] transition">
      {icon} {text}
    </button>
  );
}