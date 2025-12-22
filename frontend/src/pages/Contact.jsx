import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiPost } from "../api/client";

// Images
import contactBanner from "../assets/AboutUs/6.png";
import mapImage from "../assets/AboutUs/8.png";

export default function ContactUs() {
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

  return (
    <div className="w-full relative">
      {/* AURORA BACKGROUND OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#37215F] via-[#1B083A] to-black opacity-90 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative w-full h-[55vh] overflow-hidden">
        {/* <img
          src={contactBanner}
          alt="Contact"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90 mb-4">
            WE’RE HERE TO HELP
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            Contact Divyansh Global RO
          </h1>
          <p className="text-white/80 max-w-2xl">
            Book a service, request installation, or ask us anything about water purification.
          </p>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
        {/* LEFT INFO */}
        <div className="space-y-10 animate-fade-up">
          <div>
            <h2 className="text-4xl font-bold flex items-center gap-3">
              Get In Touch
              <span className="inline-block w-10 h-[2px] bg-cyan-400 rounded-full" />
            </h2>
            <p className="text-lg opacity-90 mt-3">
              Have questions about our RO services, installations, or maintenance? Our support team
              is ready to assist you anytime.
            </p>
          </div>

          <div className="space-y-7">
            {[
              { icon: "📞", title: "Phone", text: "+91 8948858489" },
              { icon: "✉", title: "Email", text: "divyanshgloabalro@gmail.com" },
              { icon: "📍", title: "Location", text: "Gaur city center,Noida, Uttar Pradesh, India" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-5 p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#043B82] to-[#0a59c7] flex items-center justify-center text-2xl drop-shadow-lg">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="opacity-90">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 text-sm space-y-1 text-white/80">
            <p>⏰ Service Hours: 9:00 AM – 8:00 PM (All days)</p>
            <p>📦 Coverage:Gaur city center, Noida, Greater Noida, Ghaziabad & nearby regions</p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-10 rounded-3xl bg-white/15 backdrop-blur-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)] border border-white/20 animate-fade-up">
          {success && (
            <p className="mb-6 px-4 py-3 text-green-800 bg-green-100 border border-green-300 rounded-lg">
              ✓ {success}
            </p>
          )}

          {error && (
            <p className="mb-6 px-4 py-3 text-red-800 bg-red-100 border border-red-300 rounded-lg">
              ✗ {error}
            </p>
          )}

          <h3 className="text-3xl font-extrabold text-white mb-2 drop-shadow">Send Us a Message</h3>
          {serviceParam && (
            <p className="text-sm text-cyan-200 mb-6">
              Selected service:&nbsp;
              <span className="font-semibold">{serviceParam}</span>
            </p>
          )}

          <form className="space-y-8" onSubmit={submit}>
            {[
              { label: "Your Name", field: "name", type: "text" },
              { label: "Phone Number", field: "phone", type: "text" },
              { label: "Email Address", field: "email", type: "email" },
            ].map((input, i) => (
              <div key={i} className="relative group">
                <label className="absolute -top-3 left-3 bg-[#1B083A] px-2 rounded-md text-sm text-white/80">
                  {input.label}
                </label>
                <input
                  type={input.type}
                  value={form[input.field]}
                  onChange={(e) => setForm({ ...form, [input.field]: e.target.value })}
                  required={input.field !== "email"}
                  className="w-full p-4 rounded-xl bg-white/20 text-white border border-white/30 focus:border-[#0aa2ff] focus:ring-4 focus:ring-[#0aa2ff60] transition-all outline-none placeholder-white/40"
                  placeholder={`Enter your ${input.label.toLowerCase()}`}
                />
              </div>
            ))}

            {/* MESSAGE */}
            <div className="relative group">
              <label className="absolute -top-3 left-3 bg-[#1B083A] px-2 rounded-md text-sm text-white/80">
                Your Message
              </label>
              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full p-4 rounded-xl bg-white/20 text-white border border-white/30 focus:border-[#0aa2ff] focus:ring-4 focus:ring-[#0aa2ff60] transition-all outline-none placeholder-white/40"
                placeholder="Write your message..."
              ></textarea>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.6)] hover:shadow-[0_0_35px_rgba(0,212,255,0.9)] transition-all disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            <p className="text-xs text-white/70">
              By submitting this form, you agree to be contacted by our service team over phone or
              WhatsApp.
            </p>
          </form>
        </div>
      </section>

      {/* LOCATION SECTION */}
      <section className="w-full py-10 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/20 animate-fade-up">
          <div className="w-full h-[320px] md:h-full">
            {/* You can swap this image with real Google Maps iframe when ready */}
            <img src={mapImage} className="w-full h-full object-cover" alt="Map" />
          </div>

          <div className="p-10 text-white flex flex-col justify-center">
            <h2 className="text-4xl font-bold">Greater Noida Office</h2>
            <p className="text-lg opacity-90 mt-4">
              Gaur City Center, 7th Floor, Office 0775, Sector 4, Greater Noida
            </p>
            <a
              href="https://google.com/maps"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-[#00D4FF] font-semibold mt-5 hover:underline"
            >
              Open in Google Maps &gt;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
