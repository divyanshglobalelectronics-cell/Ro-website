// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { apiGet } from '../api/client';
// import ProductCard from '../components/product&payment/ProductCard.jsx';
// import Loader from '../common/Loader.jsx';
// import HeroSlider from '../components/HeroSlider.jsx';
// import heroSide from '../assets/hero/1.jpg';

// export default function Home() {
//   const [featured, setFeatured] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     (async () => {
//       try {
//         const products = await apiGet('/api/products?featured=true');
//         setFeatured(products);
//       } catch (e) {
//         setError(e.message || 'Failed to load');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <div className='bg-gradient-to-b from-[#484b8b] to-[#1b083a]'>
//       {/* Hero Slider */}
//       <div className="relative mt-0.5">
//         <HeroSlider />
//       </div>

//       {/* Intro content below hero - full-width gradient band with two-column layout */}
//       <section className="py-12 ">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2 items-center">
//           <div>
//             <h1 className="text-3xl md:text-5xl font-serif text-white">Pure & Healthy Drinking Water for Your Family</h1>
//             <p className="mt-3 text-white/90 font-body">Buy water purifiers, commercial RO systems, and accessories. 24/7 customer support.</p>
//             <div className="mt-6 flex gap-3">
//               <Link to="/products" className="px-5 py-3 bg-white text-blue-700 font-semibold rounded">Buy Water Purifier</Link>
//               <Link to="/products?category=accessories" className="px-5 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded">Spare Parts & Accessories</Link>
//             </div>
//           </div>
//           <div className="hidden md:block">
//             <img src={heroSide} alt="Water purifier" className="w-full h-72 lg:h-80 xl:h-96 object-cover rounded-lg shadow-lg border border-white/10" />
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-[#484b8b] to-[#1b083a]">
//         <div className="flex items-end justify-between mb-2">
//           <div className=''>
//             <h2 className="text-4xl font-serif text-white">Featured Products</h2>
//             <p className="mt-2 text-white font-body">Handpicked water purifiers for your home</p>
//           </div>
//           <Link to="/products" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">View All →</Link>
//         </div>
//         {loading && <Loader />}
//         {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
//         <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
//           {featured.map((p) => (
//             <ProductCard key={p._id} product={p} />
//           ))}
//         </div>
//       </section>

//       {/* Why choose us */}
//       <section className="bg-gradient-to-b from-[#484b8b] to-[#1b083a] border-t border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <h2 className="text-3xl font-serif text-gray-900 text-center mb-12">Why Choose Us?</h2>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { title: 'Pure Water, Every Time', desc: 'Trusted filtration technology' },
//               { title: 'Smart Service Experience', desc: 'Responsive support team' },
//               { title: 'Lifetime Support & Care', desc: 'AMC, repairs, installations' },
//               { title: 'Health-First Solutions', desc: 'Quality you can rely on' },
//             ].map((f) => (
//               <div key={f.title} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
//                 <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
//                   <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
//                 </div>
//                 <h3 className="font-serif text-gray-900 text-lg">{f.title}</h3>
//                 <p className="text-sm font-body text-gray-600 mt-2">{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }




// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { apiGet } from '../api/client';
// import ProductCard from '../components/product&payment/ProductCard.jsx';
// import Loader from '../common/Loader.jsx';
// import HeroSlider from '../components/HeroSlider.jsx';
// import heroSide from '../assets/hero/1.jpg';
// import CountUp from 'react-countup';
// import { FaSquareWhatsapp } from "react-icons/fa6";


// export default function Home() {
//   const [featured, setFeatured] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     (async () => {
//       try {
//         const products = await apiGet('/api/products?featured=true');
//         setFeatured(products);
//       } catch (e) {
//         setError(e.message || 'Failed to load');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <div className="bg-gradient-to-b from-[#484b8b] to-[#1b083a]">

//       {/* HERO SLIDER */}
//       <div className="relative mt-0.5">
//         <HeroSlider />
//       </div>

//       {/* INTRO */}
//       <section className="py-12">
//         <div className="max-w-7xl mx-auto px-4 grid gap-8 md:grid-cols-2 items-center">
//           <div>
//             <h1 className="text-3xl md:text-5xl font-serif text-white">
//               Pure & Healthy Drinking Water for Your Home
//             </h1>
//             <p className="mt-3 text-white/90 font-body">
//               Buy the best RO purifiers, commercial systems & accessories.
//             </p>

//             <div className="mt-6 flex gap-3">
//               <Link to="/products" className="px-5 py-3 bg-white text-blue-700 font-semibold rounded-lg">
//                 Shop Purifiers
//               </Link>

//               <Link to="/products?category=accessories" className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
//                 Accessories
//               </Link>
//             </div>
//           </div>

//           <div className="hidden md:block">
//             <img
//               src={heroSide}
//               alt="RO purifier"
//               className="w-full h-72 lg:h-96 object-cover rounded-lg shadow-xl border border-white/10"
//             />
//           </div>
//         </div>
//       </section>

//       {/* STATS COUNTER */}
//       <section className="py-16 bg-[#1b083a]/40 backdrop-blur-lg border-t border-white/10">
//         <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-10">
//           {[
//             { label: "Happy Customers", value: 10000 },
//             { label: "Installations", value: 4500 },
//             { label: "Rating", value: 4.9, suffix: "⭐" },
//             { label: "Support 24/7", value: 1, suffix: "x" },
//           ].map((stat) => (
//             <div key={stat.label} className="text-white">
//               <p className="text-4xl font-bold">
//                 <CountUp end={stat.value} duration={2} />{stat.suffix || ""}
//               </p>
//               <p className="text-white/80 mt-1">{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CATEGORY GRID */}
//       <section className="py-16 max-w-7xl mx-auto px-4 text-white">
//         <h2 className="text-3xl font-serif mb-8">Shop By Category</h2>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[
//             { title: 'Domestic RO', link: '/products?category=domestic' },
//             { title: 'Commercial RO', link: '/products?category=commercial' },
//             { title: 'Filters & Cartridges', link: '/products?category=filters' },
//             { title: 'Spare Parts', link: '/products?category=accessories' },
//           ].map((cat) => (
//             <Link
//               key={cat.title}
//               to={cat.link}
//               className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition"
//             >
//               <h3 className="text-xl font-semibold">{cat.title}</h3>
//               <p className="text-white/80 mt-1">Explore now →</p>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* FEATURED PRODUCTS */}
//       <section className="max-w-7xl mx-auto px-4 py-16">
//         <div className="flex items-end justify-between mb-6 text-white">
//           <div>
//             <h2 className="text-4xl font-serif">Featured Products</h2>
//             <p className="mt-2 text-white/90">Handpicked best-selling purifiers</p>
//           </div>

//           <Link to="/products" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
//             View All →
//           </Link>
//         </div>

//         {loading && <Loader />}
//         {error && <p className="text-red-400">{error}</p>}

//         <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {featured.map((p) => (
//             <ProductCard key={p._id} product={p} />
//           ))}
//         </div>
//       </section>

//       {/* HOW RO WORKS */}
//       <section className="py-20 bg-white text-gray-900 rounded-t-3xl">
//         <div className="max-w-5xl mx-auto px-4">
//           <h2 className="text-4xl font-serif text-center mb-12">How RO Purification Works</h2>

//           <div className="space-y-10 border-l-4 border-blue-600 pl-8">
//             {[
//               {
//                 title: "Sediment Filtration",
//                 desc: "Removes sand, dirt, rust & heavy particles."
//               },
//               {
//                 title: "Carbon Filtration",
//                 desc: "Removes chlorine, smell & harmful chemicals."
//               },
//               {
//                 title: "RO Membrane",
//                 desc: "Eliminates TDS, heavy metals, bacteria & viruses."
//               },
//               {
//                 title: "UV/UF Treatment",
//                 desc: "Kills microorganisms & improves purity."
//               },
//               {
//                 title: "Post Carbon Polish",
//                 desc: "Enhances taste & freshness of water."
//               }
//             ].map((step, i) => (
//               <div key={i}>
//                 <h3 className="text-xl font-bold">{step.title}</h3>
//                 <p className="text-gray-600 mt-1">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIAL SLIDER */}
//       <section className="py-20 bg-gradient-to-b from-white to-blue-50">
//         <h2 className="text-4xl font-serif text-center mb-10">What Our Customers Say</h2>

//         <div className="overflow-hidden relative max-w-6xl mx-auto px-4">
//           <div className="flex animate-slide gap-6">
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="min-w-[300px] bg-white shadow-lg p-6 rounded-xl border border-gray-200"
//               >
//                 <p className="text-gray-700 italic">
//                   “Excellent RO service. Very professional & quick installation.”
//                 </p>
//                 <p className="mt-3 font-semibold text-gray-900">Customer {i + 1}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* WHATSAPP FLOAT BUTTON */}
//       <a
//         href="https://wa.me/91XXXXXXXXXX"
//         className="fixed bottom-6 right-6 bg-green-500 text-white p-1 rounded-full shadow-xl hover:bg-green-600 transition"
//       >
//         <FaSquareWhatsapp className='text-4xl rounded-full'/>
//       </a>
//     </div>
//   );
// }





import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client";
import ProductCard from "../components/product&payment/ProductCard.jsx";
import Loader from "../common/Loader.jsx";
import HeroSlider from "../components/HeroSlider.jsx";
import heroSide from "../assets/hero/1.jpg";
import CountUp from "react-countup";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { FaUserCheck, FaTools, FaStar, FaHeadset, FaTint } from "react-icons/fa";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const products = await apiGet("/api/products?featured=true");
        setFeatured(products);
      } catch (e) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Happy Customers", value: 10000, icon: <FaUserCheck /> },
      { label: "Installations Done", value: 4500, icon: <FaTools /> },
      { label: "Average Rating", value: 4.9, suffix: "⭐", icon: <FaStar /> },
      { label: "Support 24/7", value: 1, suffix: "x", icon: <FaHeadset /> },
    ],
    []
  );

  return (
    <div className="bg-gradient-to-b from-[#484b8b] to-[#1b083a]">
      {/* HERO SLIDER */}
      <div className="relative mt-0.5">
        <HeroSlider />
      </div>

      {/* INTRO / HERO CONTENT */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-cyan-200/80 mb-3">
              DIVYANSH GLOBAL RO
            </p>
            <h1 className="text-3xl md:text-5xl font-serif text-white">
              Pure & Healthy Drinking Water for Your Home
            </h1>
            <p className="mt-3 text-white/90 font-body">
              Buy the best RO purifiers, commercial systems & accessories with professional
              installation and lifetime support.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="px-5 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:shadow-lg"
              >
                Shop Water Purifiers
              </Link>

              <Link
                to="/contact?service=Free%20Water%20Test"
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Book Free Water Test
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/80">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                ✔ Free installation on selected models
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                ✔ Expert technicians
              </span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-400/40 via-transparent to-indigo-500/40 blur-2xl" />
              <img
                src={heroSide}
                alt="RO purifier"
                className="relative w-full h-72 lg:h-96 object-cover rounded-2xl shadow-2xl border border-white/10"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-2 rounded-xl backdrop-blur">
                <span className="font-semibold">RO + UV + UF | Low TDS | 12L</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-white/90 text-sm">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg border border-white/20 px-3 py-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
            <span>Free Installation</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg border border-white/20 px-3 py-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
            <span>1 Year Warranty</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg border border-white/20 px-3 py-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-300" />
            <span>Easy Returns</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg border border-white/20 px-3 py-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-300" />
            <span>Secure Payments</span>
          </div>
        </div>
      </section>

      {/* STATS COUNTER */}
      <section className="py-16 bg-[#1b083a]/40 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-white">
              <div className="mx-auto mb-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/30 text-lg">
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-bold">
                <CountUp end={stat.value} duration={2} /> {stat.suffix || ""}
              </p>
              <p className="text-white/80 mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 text-white">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-serif mb-2">Shop By Category</h2>
            <p className="text-white/80 text-sm">
              Choose the right solution for home, office or commercial needs.
            </p>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/30 text-sm hover:bg-white/20"
          >
            View all products →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Domestic RO", link: "/products?category=domestic" },
            { title: "Commercial RO", link: "/products?category=commercial" },
            { title: "Filters & Cartridges", link: "/products?category=filters" },
            { title: "Spare Parts", link: "/products?category=accessories" },
          ].map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition transform"
            >
              <h3 className="text-xl font-semibold">{cat.title}</h3>
              <p className="text-white/80 mt-1 text-sm">Explore now →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-6 text-white">
          <div>
            <h2 className="text-4xl font-serif">Featured Products</h2>
            <p className="mt-2 text-white/90">Handpicked best-selling purifiers</p>
          </div>

          <Link
            to="/products"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-sm md:text-base"
          >
            View All →
          </Link>
        </div>

        {loading && <Loader />}
        {error && <p className="text-red-400">{error}</p>}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* HOW RO WORKS */}
      <section className="py-20 bg-white text-gray-900 rounded-t-3xl">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-4">How RO Purification Works</h2>
          <p className="text-center text-gray-600 mb-10">
            Multi-stage purification ensures that every drop you drink is safe, clean and better
            tasting.
          </p>

          <div className="space-y-10 border-l-4 border-blue-600 pl-8">
            {[
              {
                title: "Sediment Filtration",
                desc: "Removes sand, dirt, rust & heavy particles to protect internal filters.",
              },
              {
                title: "Carbon Filtration",
                desc: "Removes chlorine, bad odour and harmful chemicals from water.",
              },
              {
                title: "RO Membrane",
                desc: "Eliminates high TDS, heavy metals, dissolved salts, bacteria & viruses.",
              },
              {
                title: "UV/UF Treatment",
                desc: "Neutralizes microorganisms and adds an extra layer of safety.",
              },
              {
                title: "Post Carbon Polish",
                desc: "Improves taste, clarity and freshness of water before it reaches your glass.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[2.05rem] top-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaTint className="text-blue-600" /> {step.title}
                </h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-8 text-sm md:text-base">
            Answers to common questions about RO purifiers, installation and maintenance.
          </p>
          <div className="divide-y rounded-xl border border-gray-200 overflow-hidden">
            {[{
              q: 'Which RO should I buy for high TDS water?',
              a: 'For TDS > 500, choose RO with UV/UF and mineralizer. For lower TDS, RO+UV is sufficient.'
            },{
              q: 'Do you provide installation?',
              a: 'Yes. We provide professional installation, typically within 24–48 hours of purchase.'
            },{
              q: 'How often should filters be replaced?',
              a: 'Pre-filters every 3–6 months, RO membrane 18–24 months, depending on usage and water quality.'
            }].map((item, idx) => (
              <details key={idx} className="group">
                <summary className="cursor-pointer select-none list-none p-4 sm:p-5 font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                  {item.q}
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="p-4 sm:p-5 text-gray-700 bg-white">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-10 bg-[#0B0620] text-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">
              Ready to install or upgrade your RO purifier?
            </h3>
            <p className="text-white/80 text-sm">
              Book a visit in under 60 seconds. Our team will handle the rest.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/contact?service=RO%20Installation"
              className="px-5 py-3 rounded-full bg-cyan-500 text-black font-semibold"
            >
              Book Installation →
            </Link>
            <Link
              to="/services"
              className="px-5 py-3 rounded-full border border-white/40 text-white hover:bg-white/10"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* WHATSAPP FLOAT BUTTON */}
      <a
        href="https://wa.me/91XXXXXXXXXX"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-1 rounded-full shadow-xl hover:bg-green-600 transition"
      >
        <FaSquareWhatsapp className="text-4xl rounded-full" />
      </a>
    </div>
  );
}
