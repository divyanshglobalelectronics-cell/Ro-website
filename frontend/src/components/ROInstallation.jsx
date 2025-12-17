import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Droplet, ShieldCheck, ShoppingBag } from "lucide-react";

export default function ROInstallation() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-blue-900/40 via-blue-600/20 to-transparent blur-3xl"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/30 blur-[90px] rounded-full animate-floating"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full animate-floating-late"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto relative p-12 rounded-[40px] bg-white/5 backdrop-blur-3xl border border-white/20 shadow-[0_0_80px_rgba(0,150,255,0.4)]"
      >
        <div className="absolute inset-0 rounded-[40px] border-2 border-transparent animate-glow-border pointer-events-none"></div>
        <div className="text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-7xl font-black bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-500 text-transparent bg-clip-text drop-shadow-xl tracking-widest"
          >
            RO INSTALLATION
          </motion.h1>
          <p className="mt-6 font-body text-gray-300 text-2xl max-w-3xl mx-auto">
            A hyper-premium, automated installation experience — activated instantly after purchasing your RO.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          {[
            { icon: <ShoppingBag size={50} />, title: "1. Purchase Any RO", desc: "Choose from our premium RO models." },
            { icon: <Sparkles size={50} />, title: "2. Auto Activation", desc: "Installation request triggers instantly." },
            { icon: <Zap size={50} />, title: "3. Technician Visit", desc: "Certified expert installs & calibrates your RO." },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className="p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg text-center hover:shadow-blue-500/40 transition-all"
            >
              <div className="text-blue-300 mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-2xl font-heading text-blue-200 mb-2">{item.title}</h3>
              <p className="text-gray-300 font-body text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-700/30 to-blue-500/20 p-14 rounded-3xl border border-blue-300/20 shadow-[0_0_60px_rgba(0,200,255,0.4)] mb-24 text-center backdrop-blur-2xl"
        >
          <h2 className="text-5xl font-heading mb-8 text-blue-200 drop-shadow-lg">
            Installation After Purchase
          </h2>

          <p className="text-gray-200 text-xl font-body leading-relaxed max-w-4xl mx-auto mb-10">
            Once your RO purchase is complete, your installation is **automatically added to our system**.
            A verified technician will call you within **24 hours** and complete the installation at your home.
          </p>

          <div className="bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl max-w-xl mx-auto">
            <p className="text-3xl text-blue-200 font-heading mb-2">✔ FREE Installation Included</p>
            <p className="text-gray-300 font-body">No charges. No booking. No hidden fees.</p>
          </div>
        </motion.div>
        <h2 className="text-center text-5xl font-heading text-blue-300 mb-14 drop-shadow-md">
          Premium Installation Includes
        </h2>

        <div className="flex items-center justify-center gap-12 mb-28">
          {[
            { icon: <ShieldCheck size={55} />, title: "Certified Engineers" },
            { icon: <Droplet size={55} />, title: "Leak-Proof Setup" },
            { icon: <Sparkles size={55} />, title: "TDS Calibration" },
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ scale: 1.1 }} className="p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg text-center">
              <div className="mb-4 text-blue-200 flex justify-center">{f.icon}</div>
              <p className="text-xl font-semibold text-blue-100">{f.title}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          whileHover={{ scale: 1.07 }}
          className="text-center mb-10"
        >
          <button className="px-14 py-6 text-3xl font-heading rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-[0_0_40px_rgba(0,180,255,1)] hover:shadow-[0_0_70px_rgba(0,220,255,1)] transition-all tracking-wide">
            Browse RO Models
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}