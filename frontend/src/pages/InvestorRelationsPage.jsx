import { FaChartLine, FaHandshake, FaFileAlt, FaHeadset } from "react-icons/fa";

export default function InvestorRelations() {
  return (
    <div className="w-full bg-[#f8fbfd] text-[#0b2545]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Investor Relations
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Building long-term value through transparency, growth, and trust
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Company Overview */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaHandshake className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Company Overview</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            DIVYANSH GLOBAL RO is a growing water purification solutions provider offering domestic, commercial,
            and industrial RO systems across India. Our focus is on quality products, reliable service,
            and sustainable growth. We are committed to creating long-term value for our investors through
            innovation, operational excellence, and customer satisfaction.
          </p>
        </div>

        {/* Investment Highlights */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaChartLine className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Investment Highlights</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Strong presence in the growing water purification market</li>
            <li>• Diverse product portfolio for residential, commercial, and industrial use</li>
            <li>• Focus on after-sales service and long-term customer relationships</li>
            <li>• Scalable business model with expansion opportunities</li>
            <li>• Experienced management and skilled technical team</li>
          </ul>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaFileAlt className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Financial Information</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            Financial statements, annual reports, and other relevant disclosures are shared with investors
            in a timely and transparent manner. Detailed financial information can be provided upon request
            or during scheduled investor meetings.
          </p>
        </div>

        {/* Corporate Governance */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            Corporate Governance
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            DIVYANSH GLOBAL RO follows ethical business practices and sound corporate governance principles.
            We believe transparency, accountability, and compliance are essential for maintaining investor confidence
            and sustainable growth.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#0b2545] text-white rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <FaHeadset className="text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Investor Contact</h2>
          </div>
          <p className="text-sm md:text-base mb-2">
            For investor-related queries, partnership opportunities, or financial discussions, please contact us:
          </p>
          <p className="text-sm md:text-base">
            Email: <span className="font-medium">investors@divyanshglobalro.com</span>
            <br />
            Phone: <span className="font-medium">+91-XXXXXXXXXX</span>
          </p>
        </div>
      </div>
    </div>
  );
}