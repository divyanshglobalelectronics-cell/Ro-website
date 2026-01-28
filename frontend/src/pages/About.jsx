import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaHandsHelping,
  FaLightbulb,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import AboutImage from "../assets/AboutUs/10.jpg";
import Founder from "../assets/AboutUs/founder.jpg";
import Cofounder from "../assets/AboutUs/cofounder.jpg";
import { useLocation, Link } from "react-router-dom";
import { apiPost } from "../api/client";

export default function AboutUs() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const serviceParam = params.get("service") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: serviceParam,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (serviceParam) {
      setForm((f) => ({ ...f, service: serviceParam }));
    }
  }, [serviceParam]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await apiPost("/api/inquiries", form);
      setSuccess("Thanks! We will contact you shortly.");
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        service: serviceParam,
      });
    } catch (err) {
      setError(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const timeline = [
    { year: "2023", text: "Company founded with a mission to provide clean water." },
    { year: "2023", text: "First 100+ installations completed." },
    { year: "2024", text: "Expanded to Noida & nearby regions." },
    { year: "2024", text: "Launched AMC & maintenance plans." },
    { year: "2025", text: "Trusted by thousands of households." },
  ];

  const stats = [
    { label: "Installations", value: "10k+" },
    { label: "AMC Clients", value: "3.5k+" },
    { label: "Years Experience", value: "8+" },
    { label: "Customer Rating", value: "4.9★" },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-[#071233] via-[#08243f] to-[#00121a] text-white">
      {/* HERO */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90 mb-4">
              ABOUT DIVYANSH GLOBAL RO
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              Clean, Safe & Trusted Water Solutions
            </h1>
            <p className="text-gray-200 mb-6">
              From single homes to busy offices, we design and maintain RO systems that keep your
              water pure — and your family protected.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/services"
                className="px-6 py-3 rounded-full bg-cyan-500 text-black font-semibold shadow-lg hover:bg-cyan-400"
              >
                Explore Services
              </Link>
              <Link
                to="/contact?service=RO%20Installation"
                className="px-6 py-3 rounded-full border border-white/40 text-white hover:bg-white/10"
              >
                Book Installation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 mt-10 pb-16">
        {/* ABOUT + IMAGE */}
        <section className="grid lg:grid-cols-2 gap-8 items-center mb-12">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Who we are</h2>
            <p className="text-gray-200 leading-relaxed mb-4">
              At Divyansh Global RO, we believe in clean water for every household. We design,
              install and maintain RO systems with high-grade components and a customer-first mindset.
            </p>
            <p className="text-gray-300 leading-relaxed">
              From expert installation to dependable AMC plans, our team ensures your water purifier
              works efficiently and reliably — every single day.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg"
                >
                  <div className="text-2xl font-bold text-cyan-200">{s.value}</div>
                  <div className="text-sm text-gray-300">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none" />
            <img src={AboutImage} alt="Team at work" className="w-full h-full object-cover" />
          </motion.div>
        </section>

        {/* VALUES */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="w-10 h-[2px] bg-cyan-400 rounded-full" />
            Our Values
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<FaShieldAlt className="text-4xl text-[#043B82] mb-4 mx-auto" />}
              title="Quality Assurance"
              text="High-grade components, strict quality checks and long-lasting performance."
            />
            <ValueCard
              icon={<FaHandsHelping className="text-4xl text-[#043B82] mb-4 mx-auto" />}
              title="Customer First"
              text="Friendly, responsive and transparent support at every step."
            />
            <ValueCard
              icon={<FaLightbulb className="text-4xl text-[#043B82] mb-4 mx-auto" />}
              title="Innovation"
              text="Efficient, low-wastage designs tailored to Indian water conditions."
            />
            <ValueCard
              icon={<FaUsers className="text-4xl text-[#043B82] mb-4 mx-auto" />}
              title="Trust & Integrity"
              text="Honest advice, clear pricing and no hidden surprises."
            />
          </div>
        </section>

        {/* WHY CHOOSE + FEATURE GRID */}
        <section className="bg-gradient-to-r from-[#043B82] to-[#0652a0] rounded-2xl p-8 mb-12 shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-cyan-400/20 blur-3xl" />
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            Why Families Trust Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FaShieldAlt className="text-3xl text-[#043B82]" />}
              title="Certified Technicians"
              text="Trained experts for reliable, neat and safe installation & maintenance."
            />
            <FeatureCard
              icon={<FaLightbulb className="text-3xl text-[#043B82]" />}
              title="Affordable Solutions"
              text="Right guidance and right product — no unnecessary upgrades."
            />
            <FeatureCard
              icon={<FaHandsHelping className="text-3xl text-[#043B82]" />}
              title="Quick & Reliable Support"
              text="Fast response, proactive reminders and hassle-free service."
            />
          </div>
        </section>

        {/* TIMELINE */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Our Journey</h3>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 h-full opacity-60" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <div
                  key={t.year}
                  className={`flex items-center w-full ${
                    i % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="w-full md:w-1/2 p-4">
                    <motion.div
                      whileHover={{ scale: 1.03, translateY: -4 }}
                      className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/8 shadow-md"
                    >
                      <div className="text-sm text-cyan-200 font-bold flex items-center gap-2">
                        <FaCheckCircle className="text-cyan-300" /> {t.year}
                      </div>
                      <div className="mt-2 text-gray-200">{t.text}</div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PURPOSE & ASPIRATION */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div className="bg-white p-8 rounded-2xl shadow-lg text-gray-800">
            <h4 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              🎯 Our Purpose
            </h4>
            <p>
              To make pure drinking water available and affordable for every household — by combining
              technology, trained people and trust.
            </p>
          </motion.div>

          <motion.div className="bg-white p-8 rounded-2xl shadow-lg text-gray-800">
            <h4 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              🚀 Our Aspiration
            </h4>
            <p>
              Become India’s most trusted RO service brand with a network of certified engineers,
              excellent service and a strong focus on sustainability.
            </p>
          </motion.div>
        </section>

        {/* LEADERSHIP */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-6">Our Leadership</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <LeaderCard
              name="Mr. Sanjay Kumar"
              title="Founder & CEO"
              img={Founder}
              desc={`At the heart of Divyansh Global RO Services is a vision led by our founder — a passionate expert committed to delivering safe and healthy drinking water to every home. With deep industry knowledge and a focus on quality, he built the company to combine advanced RO technology with trusted customer service.`}
            />
            <LeaderCard
              name="Adv. Abhishek Gupta"
              title="Co-Founder / Legal Advisor"
              img={Cofounder}
              desc={`Our Co-Founder and Legal Advisor brings a strong blend of science (B.Sc.) and law (LL.B.) to Divyansh Global RO Services, ensuring operations are ethical, transparent, and legally sound.`}
            />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mb-12 bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl">
          <h3 className="text-3xl font-bold text-white text-center mb-6">
            What Our Clients Say
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              text={`I was facing frequent issues with my old RO system, but Divyansh Global RO Services fixed it quickly. The technician explained everything clearly and the water quality is amazing now!`}
              name="Ravi Mehta"
              place="Delhi"
              img={`/images/user1.jpg`}
            />
            <TestimonialCard
              text={`I've been using their maintenance plan for over a year. My RO runs perfectly and they remind me before every service. Excellent experience!`}
              name="Priya Sharma"
              place="Noida"
              img={`/images/user2.jpg`}
              dark
            />
            <TestimonialCard
              text={`Their team is professional and responsive. I booked a service online, and they came the same day. Highly recommend.`}
              name="Shandeep Agrawal"
              place="Gurgaon"
              img={`/images/user3.jpg`}
            />
          </div>
        </section>

        {/* CONTACT + FORM */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/15">
              <h3 className="text-2xl font-bold mb-4">Get In Touch</h3>
              <p className="text-gray-200 mb-6">
                Have questions about our RO services, plans, or installations? Our team is ready to
                assist you.
              </p>

              <div className="space-y-4 text-sm">
                <ContactRow icon={`📞`} title={`Phone`} text={`+91 9876543210`} />
                <ContactRow icon={`✉`} title={`Email`} text={`support@divyanshglobalro.com`} />
                <ContactRow icon={`📍`} title={`Location`} text={`Noida, Uttar Pradesh, India`} />
              </div>

              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 rounded-full font-semibold shadow hover:shadow-lg text-black"
                >
                  Go to Contact Page <span>→</span>
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              {success && (
                <p className="mb-6 px-4 py-3 text-green-700 bg-green-50 border border-green-200 rounded-lg">
                  ✓ {success}
                </p>
              )}

              {error && (
                <p className="mb-6 px-4 py-3 text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  ✗ {error}
                </p>
              )}

              <h3 className="text-2xl font-bold text-[#043B82] mb-6">Send Us a Message</h3>

              <form className="space-y-4" onSubmit={submit}>
                <div className="relative">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Your Name"
                  />
                </div>

                <div className="relative">
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Phone Number"
                  />
                </div>

                <div className="relative">
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Email Address"
                  />
                </div>

                <div className="relative">
                  <textarea
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="Your Message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-semibold hover:scale-[1.02] transition"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* -------------------- Helper components -------------------- */

function ValueCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 18px 45px rgba(0,0,0,0.45)" }}
      className="bg-white p-6 rounded-2xl shadow-[0_12px_0_rgba(0,0,0,0.12)] text-center border border-gray-100"
    >
      {icon}
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-sm text-gray-600 mt-2">{text}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/8"
    >
      <div className="w-16 h-16 rounded-full bg-white p-3 flex items-center justify-center mb-4 shadow-md">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-200">{text}</p>
    </motion.div>
  );
}

function LeaderCard({ name, title, img, desc }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/8 text-center"
    >
      <img
        src={img}
        alt={name}
        className="w-40 h-40 object-cover rounded-full mx-auto mb-4 shadow-lg border-4 border-white/60"
      />
      <h4 className="text-2xl font-semibold text-white">{name}</h4>
      <div className="text-sm text-gray-300 mb-4">{title}</div>
      <p className="text-gray-200 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ text, name, place, img, dark }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`${
        dark ? "bg-[#072F53] text-white" : "bg-white text-gray-800"
      } p-6 rounded-3xl shadow-2xl relative`}
    >
      <p className={`${dark ? "text-gray-100" : "text-gray-700"} leading-relaxed`}>{text}</p>

      <div className="flex items-center gap-4 mt-6">
        <img src={img} alt={name} className="w-14 h-14 rounded-full object-cover border" />
        <div>
          <h4 className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>{name}</h4>
          <p className={`text-sm ${dark ? "text-gray-200" : "text-gray-500"}`}>{place}</p>
        </div>
      </div>

      <span
        className={`${
          dark ? "text-white/40" : "text-gray-300"
        } absolute bottom-4 right-6 text-2xl`}
      >
        ”
      </span>
    </motion.div>
  );
}

function ContactRow({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-gray-300">{text}</div>
      </div>
    </div>
  );
}
