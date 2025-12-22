import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client";
import ProductCard from "../components/product&payment/ProductCard.jsx";
import Loader from "../common/Loader.jsx";
import HeroSlider from "../components/HeroSlider.jsx";
import heroSide from "../assets/hero/1.jpg";
import CountUp from "react-countup";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { FaUserCheck, FaTools, FaStar, FaHeadset } from "react-icons/fa";
import copper1 from "../assets/imageshome/copper1.png";
import alkaline from "../assets/imageshome/alkaline.jpg";
import uv from "../assets/imageshome/uv.jpg";
import budget from "../assets/imageshome/budget.jpg";
import premium from "../assets/imageshome/premium.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import stageA from "../assets/imageshome/ro-stage-A.png";
import stage1 from "../assets/imageshome/ro-stage-1.png";
import stage2 from "../assets/imageshome/ro-stage-2.png";
import stage3 from "../assets/imageshome/ro-stage-3.png";
import stage4 from "../assets/imageshome/ro-stage-4.png";
import stage5 from "../assets/imageshome/ro-stage-5.png";
import stage6 from "../assets/imageshome/ro-stage-6.png";
import stage7 from "../assets/imageshome/ro-stage-7.png";
import picture1 from "../assets/imageshome/picture1.jpg";
import picture2 from "../assets/imageshome/picture2.jpg";
import picture3 from "../assets/imageshome/picture3.jpg";
import picture4 from "../assets/imageshome/picture4.jpg";
import picture5 from "../assets/imageshome/picture5.jpg";
import picture6 from "../assets/imageshome/picture6.jpg";
import bgRO from "../assets/imageshome/bgRO.jpg";
import DivyanshGlobal from "../assets/imageshome/Divyanshglobalro.png";
import LocalRo from "../assets/imageshome/localro.jpg";
import OtherRo from "../assets/imageshome/other-ro.jpg";


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
      <section className="py-12 bg-[#072F53]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Discover Our RO Series</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

            <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
              <div className="w-full h-60 overflow-hidden rounded-lg flex items-center justify-center">
                <img src={copper1} className="w-full h-full object-cover" alt="Copper RO" />
              </div>

              <h3 className="text-xl font-semibold mt-4">Copper RO</h3>
              <p className="text-gray-600 text-sm mt-2">Adds copper goodness to every sip.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">View Products</button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
              <div className="w-full h-60 overflow-hidden rounded-lg flex items-center justify-center">
                <img src={alkaline} className="w-full h-full object-cover" alt="Copper RO" />
              </div>

              <h3 className="text-xl font-semibold mt-4">Alkaline RO</h3>
              <p className="text-gray-600 text-sm mt-2">Balanced pH for better hydration.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">View Products</button>
            </div>


            <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
              <img src={uv} className="w-full h-60 object-contain" alt="UV + RO" />
              <h3 className="text-xl font-semibold mt-4">UV + RO</h3>
              <p className="text-gray-600 text-sm mt-2">Double purification for 100% safety.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">View Products</button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
              <img src={budget} className="w-full h-60 object-contain" alt="Budget RO" />
              <h3 className="text-xl font-semibold mt-4">Budget RO</h3>
              <p className="text-gray-600 text-sm mt-2">Smart purification at best prices.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">View Products</button>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5 text-center hover:shadow-lg transition">
              <img src={premium} className="w-full h-60 object-contain" alt="Premium RO" />
              <h3 className="text-xl font-semibold mt-4">Premium RO</h3>
              <p className="text-gray-600 text-sm mt-2">Modern design with advanced filtration.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">View Products</button>
            </div>

          </div>
        </div>
      </section>

      <section className="max-w-screen py-16 bg-[#072F53]">
        <div className=" mx-auto px-6">

          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#EAF7FC] mb-12">
            RO 7-Stage <span className="text-[#6EC1E4]">Purification</span>
          </h2>

          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="pb-10"
          >
            {/* SLIDE A */}
            <SwiperSlide>
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="h-[330px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img src={stageA} className="h-full object-contain" alt="all stages" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#072F53] text-center">
                  Advanced Multi-Stage RO Filtering Technology
                </h3>
                <p className="text-gray-600 text-center text-sm mt-1">
                  “One advanced RO system.”
                  Pure, safe and refreshing water—every single drop.”
                </p>
              </div>
            </SwiperSlide>
            {/* SLIDE 1 */}
            <SwiperSlide>
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="h-[330px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img src={stage1} className="h-full object-contain" alt="Stage 1" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#072F53] text-center">
                  Stage 1-Pre-Sediment Filter
                </h3>
                <p className="text-gray-600 text-center text-sm mt-1">
                  Removes dust, mud, sand, and visible impurities from water.

                  Protects the inner filters and increases purification lifespan.
                </p>
              </div>
            </SwiperSlide>

            {/* SLIDE 2 */}
            <SwiperSlide>
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="h-[330px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img src={stage2} className="h-full object-contain" alt="Stage 2" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#072F53] text-center">
                  Stage 2 — Sediment Filter
                </h3>
                <p className="text-gray-600 text-center text-sm mt-1">
                  Eliminates finer particles like silt and rust.

                  Ensures smooth water flow and prevents filter clogging.
                </p>
              </div>
            </SwiperSlide>

            {/* SLIDE 3 */}
            <SwiperSlide>
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="h-[330px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img src={stage3} className="h-full object-contain" alt="Stage 3" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#072F53] text-center">
                  Stage 3 — Activated Carbon Filter
                </h3>
                <p className="text-gray-600 text-center text-sm mt-1">
                  Absorbs chlorine, bad smell, and organic chemicals.

                  Improves water taste and odor naturally.
                </p>
              </div>
            </SwiperSlide>



            {/* Add 4-7 same way */}

            <SwiperSlide>
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="h-[330px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img src={stage4} className="h-full object-contain" alt="Stage 4" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#072F53] text-center">
                  Stage 4 — RO Membrane
                </h3>
                <p className="text-gray-600 text-center text-sm mt-1">
                  Removes dissolved salts, TDS, heavy metals, and bacteria.

                  Delivers pure, safe, and healthy drinking water.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="h-[330px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img src={stage5} className="h-full object-contain" alt="Stage 5" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#072F53] text-center">
                  Stage 5 — UV Chamber
                </h3>
                <p className="text-gray-600 text-center text-sm mt-1">
                  Kills harmful bacteria, viruses, and microorganisms.

                  Ensures microbiologically safe water for your family.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="h-[330px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img src={stage6} className="h-full object-contain" alt="Stage 6" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#072F53] text-center">
                  Stage 6 — UF Filter
                </h3>
                <p className="text-gray-600 text-center text-sm mt-1">
                  Filters out remaining fine particles and impurities.

                  Provides crystal-clear, safe, and clean water.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="h-[330px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img src={stage7} className="h-full object-contain" alt="Stage 7" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#072F53] text-center">
                  Stage 7 — Alkaline Filter
                </h3>
                <p className="text-gray-600 text-center text-sm mt-1">
                  Adds essential minerals like calcium and magnesium.

                  Balances pH level and enhances water taste & health benefits.
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
      <section className="w-full py-20 bg-[#072F53] text-white">
        <h2 className="text-center text-4xl font-extrabold tracking-wide">
          What Our <span className="text-[#6EC1E4]">Customers Say</span>
        </h2>

        <p className="text-center text-gray-200 mt-2 text-lg mb-12">
          Genuine Reviews • Trusted Service • Happy Customers
        </p>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2800 }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-[90%] md:w-[80%] mx-auto mt-10"
        >
          {[
            {
              name: "Riya Sharma",
              review:
                "Amazing RO installation service! Very fast and professional work. Highly recommended!",
              photo: "https://i.ibb.co/z6YwHcy/user1.jpg",
            },
            {
              name: "Amit Verma",
              review:
                "Great experience! The RO water tastes fresh and pure. Super clean installation.",
              photo: "https://i.ibb.co/0j9CcH4/user2.jpg",
            },
            {
              name: "Sneha Patel",
              review:
                "Premium installation is awesome! Technician explained everything properly.",
              photo: "https://i.ibb.co/pdcf4Bd/user3.jpg",
            },
            {
              name: "Kunal Singh",
              review:
                "Affordable and quick installation. Loved the service quality!",
              photo: "https://i.ibb.co/S0V0KjK/user4.jpg",
            },
            {
              name: "Rohit Rajput",
              review:
                "Premium installation is awesome! Technician explained everything properly.",
              photo: "https://i.ibb.co/pdcf4Bd/user3.jpg",
            },
            {
              name: "Manish Verma ",
              review:
                "Premium installation is awesome! Technician explained everything properly.",
              photo: "https://i.ibb.co/pdcf4Bd/user3.jpg",
            },
          ].map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg hover:scale-[1.03] transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-20 h-20 rounded-full border-4 border-white/40 mb-4"
                  />

                  <h3 className="text-xl font-semibold">{item.name}</h3>

                  <p className="text-gray-200 mt-3 text-sm leading-relaxed">
                    {item.review}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {/* RO FEATURES */}
      <section className="w-full py-20 bg-[#072F53]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#DCE6EF] mb-12">
            Our RO System <span className="text-[#6EC1E4]">Core Features</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {[
              { img: picture1, title: "RO + UV + UF + TDS Technology", desc: "Multi-stage advanced purification system for healthy drinking water." },
              { img: picture2, title: "High Quality Build", desc: "Premium quality components ensure durability and long service life." },
              { img: picture3, title: "Fully Automatic", desc: "Zero manual effort. Automatic purification & auto shut-off." },
              { img: picture4, title: "Customer Care Support", desc: "Dedicated support team available to assist you instantly." },
              { img: picture5, title: "100% Safe & Pure", desc: "Delivers clean, safe, and great-tasting drinking water every time." },
              { img: picture6, title: "Premium Look", desc: "Modern and luxurious design that enhances your home interior." }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center"
              >
                {/* BIG IMAGE HERE */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-36 h-36 object-contain mb-5"
                />

                {/* TITLE */}
                <h3 className="text-xl font-bold text-[#003B95] text-center mb-2">
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-center leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>
      <section
        className="relative w-full py-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgRO})` }}  // <-- Your BG image
      >
        {/* Low-opacity overlay */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

        <div className="relative max-w-5xl mx-auto px-4">

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003B95]">
              Why Choose <span className="text-[#6EC1E4]">Divyansh Global RO?</span>
            </h2>
            <p className="text-gray-700 mt-1 text-sm">
              Clear comparison between our RO and other local brands
            </p>
          </div>

          {/* Small Table Card */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-[#6EC1E4]">

            {/* Top Logos Row */}
            <div className="grid grid-cols-4 py-4 bg-[#003B95] text-white text-center text-sm font-semibold">
              <div>Features</div>

              {/* Brand B → Our RO */}
              <div className="flex flex-col items-center">
                <img src={DivyanshGlobal} className="w-10 h-10 object-contain mb-1" alt="1"/>
                Divyansh RO
              </div>

              {/* Brand A local */}
              <div className="flex flex-col items-center">
                <img src={LocalRo} className="w-10 h-10 object-contain mb-1" alt="2"/>
                Brand A
              </div>

              {/* Brand B other */}
              <div className="flex flex-col items-center">
                <img src={OtherRo} className="w-10 h-10 object-contain mb-1" alt="3"/>
                Brand B
              </div>
            </div>

            <div className="divide-y">

              {/* Row: Intelligent Filtration */}
              <div className="grid grid-cols-4 p-4 text-center text-sm items-center">
                <p className="font-medium text-[#003B95] text-left">
                  Intelligent Filtration
                </p>
                <span className="text-green-500 text-xl">✔</span>
                <span className="text-red-500 text-xl">✖</span>
                <span className="text-red-500 text-xl">✖</span>
              </div>

              {/* Row: Selectable Modes */}
              <div className="grid grid-cols-4 p-4 text-center text-sm items-center">
                <p className="font-medium text-[#003B95] text-left">
                  Multiple Purification Modes
                </p>
                <span className="text-green-500 text-xl">✔</span>
                <span className="text-red-500 text-xl">✖</span>
                <span className="text-red-500 text-xl">✖</span>
              </div>

              {/* Row: RO Only When Needed */}
              <div className="grid grid-cols-4 p-4 text-center text-sm items-center">
                <p className="font-medium text-[#003B95] text-left">RO Only When Needed</p>
                <span className="text-green-500 text-xl">✔</span>
                <span className="text-red-500 text-xl">✖</span>
                <span className="text-red-500 text-xl">✖</span>
              </div>

              {/* Row: IoT */}
              <div className="grid grid-cols-4 p-4 text-center text-sm items-center">
                <p className="font-medium text-[#003B95] text-left">Smart IoT Features</p>
                <span className="text-green-500 text-xl">✔</span>
                <span className="text-green-500 text-xl">✔</span>
                <span className="text-red-500 text-xl">✖</span>
              </div>

              {/* Row: Warranty */}
              <div className="grid grid-cols-4 p-4 text-center text-sm items-center">
                <p className="font-medium text-[#003B95] text-left">Warranty / Quality</p>
                <span className="text-green-500 text-xl">✔</span>
                <span className="text-red-500 text-xl">✖</span>
                <span className="text-red-500 text-xl">✖</span>
              </div>

            </div>
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
            }, {
              q: 'Do you provide installation?',
              a: 'Yes. We provide professional installation, typically within 24–48 hours of purchase.'
            }, {
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
