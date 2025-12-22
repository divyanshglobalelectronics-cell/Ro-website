import { Link } from "react-router-dom";
import { FaTools, FaRecycle, FaPlusCircle, FaFlask } from "react-icons/fa";

const services = [
  {
    key: "repair",
    title: "RO Repair & Maintenance",
    desc: "Expert repair for all leading RO brands. Genuine parts and quick turnaround.",
    icon: <FaTools />,
  },
  {
    key: "amc",
    title: "Annual Maintenance (AMC)",
    desc: "Keep your RO performing like new with our affordable AMC plans.",
    icon: <FaRecycle />,
  },
  {
    key: "installation",
    title: "New Installations",
    desc: "Professional installation for domestic and commercial RO systems.",
    icon: <FaPlusCircle />,
  },
  {
    key: "water-test",
    title: "Free Water Quality Check",
    desc: "Book a free TDS and water quality test for your home or office.",
    icon: <FaFlask />,
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fbff] to-[#dce8ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-500 mb-2">
            SERVICES & SUPPORT
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Our RO Services</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            We provide complete RO solutions from installation to lifetime support for homes,
            offices and commercial spaces.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.key}
              className="bg-white border border-blue-50 rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition transform"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3 text-lg">
                {s.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/contact?service=${encodeURIComponent(s.title)}`}
                  className="px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Enquire
                </Link>
                <a
                  href={`https://wa.me/8948858489?text=${encodeURIComponent(
                    "I want to know about " + s.title
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Why choose us?</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-blue-900/80 space-y-1">
              <li>Trusted technicians and genuine parts</li>
              <li>Responsive support and fast service</li>
              <li>Affordable AMC and maintenance plans</li>
              <li>Serving homes and businesses</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-blue-900 font-semibold">Need help right now?</p>
            <Link
              to="/contact?service=Emergency%20RO%20Service"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Book Service in 60 Seconds →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
