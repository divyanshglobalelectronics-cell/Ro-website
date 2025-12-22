import { FaBalanceScale, FaUsers, FaShieldAlt, FaGavel } from "react-icons/fa";

export default function CodeOfConductPage() {
  return (
    <div className="w-full bg-[#f8fbfd] text-[#0b2545]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Code of Conduct
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Ethical standards and professional behavior at DIVYANSH GLOBAL RO
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaBalanceScale className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Purpose & Scope</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            This Code of Conduct outlines the ethical principles, values, and professional standards
            that guide all employees, partners, vendors, and representatives of DIVYANSH GLOBAL RO.
            Everyone associated with the company is expected to act with integrity, honesty, and respect
            in all business dealings.
          </p>
        </div>

        {/* Ethical Practices */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Ethical Business Practices</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Conduct business with honesty, transparency, and fairness.</li>
            <li>• Comply with all applicable laws, regulations, and industry standards.</li>
            <li>• Avoid conflicts of interest and disclose them when they arise.</li>
            <li>• Prohibit bribery, corruption, and unethical influence of any kind.</li>
            <li>• Protect company assets, data, and confidential information.</li>
          </ul>
        </div>

        {/* Workplace Conduct */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaUsers className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Workplace Conduct</h2>
          </div>
          <ul className="space-y-2 text-sm md:text-base leading-relaxed">
            <li>• Treat colleagues, customers, and partners with dignity and respect.</li>
            <li>• Maintain a safe, inclusive, and harassment-free workplace.</li>
            <li>• Encourage diversity, equality, and teamwork.</li>
            <li>• Use company resources responsibly and for legitimate purposes only.</li>
            <li>• Follow professional behavior both online and offline.</li>
          </ul>
        </div>

        {/* Compliance & Reporting */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FaGavel className="text-[#1e90ff] text-2xl" />
            <h2 className="text-xl md:text-2xl font-semibold">Compliance & Reporting</h2>
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            Any violation of this Code of Conduct should be reported immediately.
            All complaints will be handled confidentially and investigated fairly.
            Retaliation against individuals who raise concerns in good faith is strictly prohibited.
          </p>
        </div>

        {/* Consequences */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            Disciplinary Action
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            Violation of this Code of Conduct may result in disciplinary action,
            including warnings, suspension, termination of association, or legal action,
            depending on the severity of the misconduct.
          </p>
        </div>
      </div>
    </div>
  );
}