import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What services does Divyansh Global RO provide?",
      answer:
        "We offer RO installation, repair, maintenance, water purifier servicing, filter change, AMC plans, and expert on-site support.",
    },
    {
      question: "How often should I service my RO?",
      answer:
        "For best performance and safe drinking water, your RO should be serviced every 3–4 months depending on usage.",
    },
    {
      question: "Do you provide doorstep service?",
      answer:
        "Yes, we provide quick doorstep RO service across multiple locations with expert technicians.",
    },
    {
      question: "What are your AMC plans?",
      answer:
        "We offer affordable Annual Maintenance Contracts covering multiple visits, filter changes, and priority support.",
    },
    {
      question: "Do you use genuine spare parts?",
      answer:
        "Yes, all our filters, membranes, and spare parts are 100% genuine and quality tested.",
    },
    {
      question: "How can I book a service?",
      answer:
        "You can book instantly through our website, call our helpline, or contact us on WhatsApp for quick support.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EAF7FC] py-16 px-5">
      {/* Top Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0C62AB]">
          Frequently Asked Questions
        </h1>
        <p className="text-[#2D2D2D] mt-3 text-lg">
          Everything you need to know about our RO services.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#F4FBFF] border border-[#DCE6EF] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Question Row */}
            <div
              onClick={() => toggleFAQ(index)}
              className="cursor-pointer flex justify-between items-center p-5"
            >
              <h2 className="text-lg md:text-xl font-semibold text-[#072F53]">
                {faq.question}
              </h2>

              <FaChevronDown
                className={`text-[#0C62AB] transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Answer Row */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 p-5" : "max-h-0 p-0"
              }`}
            >
              <p className="text-[#2D2D2D] leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold text-[#072F53]">
          Still have a question?
        </h3>
        <p className="text-[#2D2D2D] mt-2">
          Our support team is here to help you anytime.
        </p>

        <a
          href="/contact"
          className="inline-block mt-4 bg-[#0C62AB] text-white px-8 py-3 rounded-xl font-semibold
          shadow-lg hover:bg-[#0A85D9] transition-all duration-300"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}