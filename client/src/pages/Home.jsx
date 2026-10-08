import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  ShieldCheck,
  Factory,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { useAuth } from "../context/AuthContext";

import ProductCard from "../components/ProductCard";
import GlobalExcellence from "../components/GlobalExcellence";
import GlobalShipping from "../components/GlobalShipping";
import Certificates from "../components/Certificates";
import StandardsCTA from "../components/StandardsCTA";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

// Image Imports
import HeroImage from "../assets/HeroImage/HeroImage.png";
import herbalCapsuleImage from "../assets/CategoriesImages/herbalCapsule.png";
import herbalOilImage from "../assets/CategoriesImages/herbalOil.png";
import powderImage from "../assets/CategoriesImages/powder.png";
import herbalSyrupImage from "../assets/CategoriesImages/herbalSyrup.png";
import tabletImage from "../assets/CategoriesImages/tablet.png";
import shilajitImage from "../assets/CategoriesImages/shilajit.png";
import comboImage from "../assets/CategoriesImages/combo.png";

// combos image
import comboShilajitCapsule from "../assets/ComboImages/shilajits&herbalCapsules.png";
import comboOilPowder from "../assets/ComboImages/herbalOils&herbalPowders.png";

// Nayi Images for Sections
import philosophyImg from "../assets/philosophy.png";
import ghibliBotanicalImg from "../assets/botanical-bg.png";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionRef = useRef(null);
  const heroRef = useRef(null);

  const [homeCategories, setHomeCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const [activeSolutionTab, setActiveSolutionTab] = useState("Herbal Tablets");

  const { user } = useAuth();
  const isFranchise = user?.role === "franchise";

  useEffect(() => {
    const fetchHomeCategories = async () => {
      try {
        const data = await getCategories();
        setHomeCategories(data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchHomeCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const bestSellers = useMemo(() => {
    if (!products.length) return [];
    const explicitlyMarked = products.filter((p) => p.isBestSeller);
    if (explicitlyMarked.length > 0) return explicitlyMarked.slice(0, 8);
    return [...products]
      .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
      .slice(0, 8);
  }, [products]);

  const categories = useMemo(() => {
    return [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
  }, [products]);

  const categoryImages = {
    "Herbal Capsules": herbalCapsuleImage,
    "Herbal Oils": herbalOilImage,
    "Herbal Powders": powderImage,
    "Herbal Syrups": herbalSyrupImage,
    "Herbal Tablets": tabletImage,
    "Shilajits": shilajitImage,
    "Combos": comboImage,
  };

  useGSAP(() => {
    gsap.fromTo(
      ".animate-in",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
    );

    gsap.fromTo(
      ".philosophy-img",
      { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
      {
        clipPath: "inset(0% 0 0 0)",
        scale: 1,
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: ".philosophy-section",
          start: "top 75%",
        },
      },
    );

    gsap.fromTo(
      ".ghibli-bg",
      { y: -50, scale: 1.05 },
      {
        y: 50,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".ghibli-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    const revealElements = gsap.utils.toArray(".reveal-on-scroll");
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        },
      );
    });

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 2;
      const yPos = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to(".float-fast", {
        x: xPos * -60,
        y: yPos * -60,
        duration: 1.5,
        ease: "power2.out",
      });
      gsap.to(".float-medium", {
        x: xPos * -40,
        y: yPos * -40,
        duration: 1.5,
        ease: "power2.out",
      });
      gsap.to(".float-slow", {
        x: xPos * -20,
        y: yPos * -20,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    gsap.from(".mouse-parallax", {
      scale: 0,
      opacity: 0,
      rotation: 0,
      duration: 1.5,
      stagger: 0.15,
      ease: "back.out(1.2)",
      delay: 0.3,
    });

    gsap.to(".infinite-float", {
      y: -15,
      rotation: "+=2",
      duration: 2.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { amount: 1.5, from: "random" },
    });

    gsap.to(".marquee-content", {
      xPercent: -50,
      repeat: -1,
      duration: 25,
      ease: "linear",
    });

    const magneticButtons = gsap.utils.toArray(".magnetic-btn");
    magneticButtons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.4;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.4;
        gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)",
        });
      });
    });

    gsap.to(".float-fast", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".float-medium", {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".float-slow", {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useGSAP(
    () => {
      if (categories.length === 0) return;

      gsap.fromTo(
        ".category-card-reveal",
        { opacity: 0, x: -100, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".category-grid-container",
            start: "top 85%",
          },
        },
      );
    },
    { dependencies: [categories] },
  );

  return (
    // 🌟 Modified Mobile Top Padding from pt-4 to pt-0 if it was pushing too much, keeping md:pt-6
    <main className="min-h-screen pt-0 md:pt-6 pb-8 md:pb-24 bg-[#080D0A] overflow-hidden text-[#F5F2EB]">
      <div className="w-full px-4 sm:px-8 md:px-10 lg:px-16 flex flex-col items-center">
        {/* ===================================================== */}
        {/* 1. HERO SECTION */}
        {/* ===================================================== */}
        <div
          ref={heroRef}
          className="relative w-full min-h-[80vh] md:min-h-[85vh] flex items-center justify-center mb-8 overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-emerald-600/10 blur-[100px]" />
          </div>

          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
            <div className="marquee-content flex whitespace-nowrap font-serif text-[18vw] tracking-wider text-transparent [-webkit-text-stroke:2px_#F5F2EB]">
              <span className="pr-12">
                HOLYBASIL AYURVEDA • PURE AYURVEDA • HOLISTIC WELLNESS • PURE
                AYURVEDA •
              </span>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
            <div className="mouse-parallax float-fast absolute top-[10%] left-0 lg:left-[5%] w-32 md:w-44 lg:w-52 aspect-square rotate-[-8deg]">
              <div className="infinite-float w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-[4px] border-[#16231D]/50">
                <img
                  src={herbalOilImage}
                  alt="Ayurvedic Oils"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="mouse-parallax float-slow absolute top-[15%] right-0 lg:right-[5%] w-28 md:w-40 lg:w-48 aspect-[4/5] rotate-[10deg]">
              <div className="infinite-float w-full h-full rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border-[4px] border-[#16231D]/50">
                <img
                  src={shilajitImage}
                  alt="Premium Shilajit"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="mouse-parallax float-medium absolute bottom-[10%] left-[2%] lg:left-[8%] w-36 md:w-52 lg:w-60 aspect-[4/3] rotate-[6deg]">
              <div className="infinite-float w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-[4px] border-[#16231D]/50">
                <img
                  src={powderImage}
                  alt="Herbal Powders"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="mouse-parallax float-fast absolute bottom-[15%] right-[2%] lg:right-[8%] w-40 md:w-60 lg:w-72 aspect-[16/9] rotate-[-5deg]">
              <div className="infinite-float w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-[4px] border-[#16231D]/50">
                <img
                  src={HeroImage}
                  alt="Ayurvedic Extracts"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none z-10 sm:hidden overflow-hidden">
            <div className="absolute top-[8%] left-[6%] animate-pulse bg-[#121E1A]/80 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg rotate-[-6deg]">
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                🌿 100% Organic
              </span>
            </div>
            <div className="absolute top-[18%] right-[6%] animate-bounce duration-1000 bg-[#121E1A]/80 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg rotate-[8deg]">
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                ✨ Pure Extracts
              </span>
            </div>
            <div className="absolute bottom-[22%] left-[8%] bg-[#121E1A]/80 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg rotate-[4deg]">
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                🏔️ Himalayan Herbs
              </span>
            </div>
          </div>

          <div className="relative z-20 max-w-3xl text-center flex flex-col items-center animate-in px-2 sm:px-4 pointer-events-auto mt-16 md:mt-0">
            <span className="eyebrow inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80 bg-[#121E1A]/80 px-4 py-2 rounded-full backdrop-blur-md border border-emerald-500/20 shadow-sm">
              Premium Ayurvedic Wellness
            </span>
            <h1 className="display mt-6 font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.1] text-white">
              Ancient wisdom.
              <br />
              <span className="text-emerald-400/90 italic font-normal">
                Refined for today.
              </span>
            </h1>
            <p className="mt-6 text-base md:text-xl leading-relaxed text-[#F5F2EB]/70 max-w-xl font-medium">
              Authentic wellness products created with carefully selected
              ingredients and quality-focused modern practices.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link
                to="/products"
                className="magnetic-btn inline-flex items-center justify-center gap-2 px-8 py-4 text-sm md:text-base rounded-full bg-emerald-600 text-white font-bold shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all w-full sm:w-auto"
              >
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link
                to="/manufacturing"
                className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 px-8 py-4 text-sm font-bold text-emerald-50 transition-colors hover:bg-emerald-600/10 w-full sm:w-auto"
              >
                Private Label Services
              </Link>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* CATEGORIES (Dark Swiper) */}
        {/* ===================================================== */}
        <div className="w-full max-w-[90rem] mx-auto mb-8 relative">
          <div className="text-center mb-8 md:mb-14 reveal-on-scroll">
            <span className="eyebrow inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
              Discover
            </span>
            <h2 className="mt-2 md:mt-3 font-serif text-3xl md:text-5xl text-white">
              Explore Ayurvedic wellness
            </h2>
          </div>

          <div className="relative group category-grid-container px-4 sm:px-8 md:px-0">
            <Swiper
              modules={[FreeMode, Navigation, Pagination]}
              freeMode={true}
              grabCursor={true}
              spaceBetween={12}
              breakpoints={{
                640: { spaceBetween: 20 },
                1024: { spaceBetween: 24 },
              }}
              slidesPerView="auto"
              navigation={{ nextEl: ".cat-next", prevEl: ".cat-prev" }}
              pagination={{ type: "progressbar" }}
              style={{
                "--swiper-pagination-color": "#34D399",
                "--swiper-pagination-progressbar-bg-color":
                  "rgba(16, 185, 129, 0.1)",
                "--swiper-pagination-progressbar-size": "4px",
              }}
              className="!pb-12 md:!pb-16 [&>.swiper-pagination-progressbar]:!top-auto [&>.swiper-pagination-progressbar]:!bottom-0 md:[&>.swiper-pagination-progressbar]:!bottom-2 [&>.swiper-pagination-progressbar]:!left-1/2 [&>.swiper-pagination-progressbar]:!-translate-x-1/2 [&>.swiper-pagination-progressbar]:!w-[150px] sm:[&>.swiper-pagination-progressbar]:!w-[300px] [&>.swiper-pagination-progressbar]:!rounded-full"
            >
              {categories.map((category) => {
                const categoryImage = categoryImages[category] || HeroImage;
                return (
                  <SwiperSlide key={category} className="!w-auto">
                    <Link
                      to={`/products?category=${encodeURIComponent(category)}`}
                      className="category-card-reveal w-[140px] sm:w-[250px] md:w-[280px] opacity-0 group/card relative p-3 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#121E1A] border border-emerald-900/30 shadow-sm transition-all duration-500 hover:bg-[#16231D] hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:-translate-y-2 flex flex-col items-center text-center"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 md:mb-4 shrink-0 shadow-inner">
                        <img
                          src={categoryImage}
                          alt={category}
                          className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover/card:scale-105 opacity-90 group-hover/card:opacity-100"
                        />
                      </div>
                      <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#F5F2EB] group-hover/card:text-emerald-400 transition-colors w-full line-clamp-1 px-1">
                        {category}
                      </h3>
                      <span className="mt-1 text-[10px] sm:text-xs text-[#F5F2EB]/50 group-hover/card:text-emerald-300/80 transition-colors font-medium">
                        View Products &rarr;
                      </span>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <button className="hidden md:flex cat-prev absolute left-0 top-[40%] -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 items-center justify-center rounded-full bg-[#121E1A]/90 backdrop-blur-md border border-emerald-500/20 shadow-lg text-emerald-400 transition-all hover:bg-emerald-600 hover:text-white hover:scale-110 disabled:opacity-0 disabled:pointer-events-none cursor-pointer">
              <ChevronLeft size={24} />
            </button>
            <button className="hidden md:flex cat-next absolute right-0 top-[40%] -translate-y-1/2 translate-x-6 z-20 w-12 h-12 items-center justify-center rounded-full bg-[#121E1A]/90 backdrop-blur-md border border-emerald-500/20 shadow-lg text-emerald-400 transition-all hover:bg-emerald-600 hover:text-white hover:scale-110 disabled:opacity-0 disabled:pointer-events-none cursor-pointer">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* ===================================================== */}
        {/* BEST SELLERS (Dark Theme) */}
        {/* ===================================================== */}
        <div className="w-full max-w-6xl reveal-on-scroll mb-8">
          <div className="text-center mb-8 md:mb-12">
            <span className="eyebrow inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
              Customer Favorites
            </span>
            <h2 className="mt-2 md:mt-3 font-serif text-3xl md:text-4xl text-white">
              Best Sellers
            </h2>
          </div>
          <div className="w-full px-4 sm:px-8 md:px-0">
            <Swiper
              modules={[FreeMode, Navigation, Autoplay]}
              freeMode={true}
              grabCursor={true}
              spaceBetween={12}
              slidesPerView={1.3}
              loop={bestSellers.length >= 4}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2.2, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="!pb-12"
            >
              {bestSellers.map((product) => (
                <SwiperSlide key={product._id} className="!h-auto">
                  <div className="h-full transition-transform hover:-translate-y-2">
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* ===================================================== */}
        {/* PROBLEM FINDER (Dark Theme) */}
        {/* ===================================================== */}
        <div className="w-full max-w-6xl reveal-on-scroll mb-8">
          <div className="text-center mb-8 md:mb-10">
            <span className="eyebrow inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
              Targeted Wellness
            </span>
            <h2 className="mt-2 md:mt-3 font-serif text-3xl md:text-4xl text-white">
              What Would You Like to Improve?
            </h2>
            <p className="mt-2 text-xs md:text-sm text-[#F5F2EB]/60 max-w-md mx-auto">
              Select your health focus to discover recommended natural
              formulations.
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 md:mt-8">
              {[
                { label: "Immunity", value: "Herbal Tablets" },
                { label: "Energy", value: "Shilajits" },
                { label: "Oils", value: "Herbal Oils" },
                { label: "Capsules", value: "Herbal Capsules" },
                { label: "Powders", value: "Powders" },
              ].map((tab, index) => {
                const isActive =
                  activeSolutionTab === tab.value ||
                  (activeSolutionTab === "All" && index === 0);
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveSolutionTab(tab.value)}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[11px] md:text-sm font-bold transition-all duration-300 ${isActive ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-[#121E1A] text-[#F5F2EB]/80 border border-emerald-900/30 hover:border-emerald-500/50"}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-6 md:pb-0 px-4 sm:px-8 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {products
              .filter((p) => {
                const currentTab =
                  activeSolutionTab === "All" ? "Immunity" : activeSolutionTab;
                const productCat = (p.category || "").toLowerCase();
                const targetCat = currentTab.toLowerCase();
                return (
                  productCat.includes(targetCat) ||
                  targetCat.includes(productCat)
                );
              })
              .slice(0, 4)
              .map((product) => (
                <div
                  key={product._id}
                  className="h-full transition-transform hover:-translate-y-2 shrink-0 w-[65vw] sm:w-[250px] md:w-auto snap-center md:snap-align-none"
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        </div>

        {/* ===================================================== */}
        {/* BUNDLES (Dark Theme) */}
        {/* ===================================================== */}
        <div className="w-full max-w-6xl reveal-on-scroll mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-12 text-center md:text-left">
            <div className="w-full md:w-auto">
              <span className="eyebrow inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
                Exclusive Savings
              </span>
              <h2 className="mt-2 md:mt-3 font-serif text-3xl md:text-5xl text-white">
                Curated Bundles
              </h2>
            </div>
            <p className="mt-3 md:mt-0 text-xs md:text-sm text-[#F5F2EB]/60 max-w-sm mx-auto md:mx-0">
              Expertly paired formulations designed to work synergistically for
              your complete holistic well-being. Save up to 20%.
            </p>
          </div>

          <div className="max-w-5xl mx-auto flex md:grid md:grid-cols-3 gap-4 md:gap-10 overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-6 md:pb-0 px-4 sm:px-8 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* BUNDLE 1 */}
            <div className="group relative rounded-[2rem] md:rounded-[2.5rem] bg-[#121E1A] border border-emerald-900/30 shadow-lg transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:border-emerald-500/30 flex flex-col overflow-hidden shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center">
              <div className="relative h-44 sm:h-52 md:h-[22rem] w-full overflow-hidden bg-[#080D0A]">
                <div className="absolute top-4 right-4 md:top-5 md:right-5 bg-emerald-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full z-30 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  Save 20%
                </div>
                <img
                  src={comboShilajitCapsule}
                  alt="Daily Immunity & Energy Duo"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="p-5 md:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-400/60">
                    Complete Vitality Kit
                  </span>
                  <h3 className="font-serif text-xl md:text-3xl text-white mt-1.5 mb-2 md:mt-2 md:mb-3">
                    Daily Immunity & Energy Duo
                  </h3>
                  <p className="text-[#F5F2EB]/60 text-xs md:text-base mb-4 md:mb-6 leading-relaxed line-clamp-2">
                    Combine our pure Himalayan Shilajit Resin with certified
                    organic Herbal Capsules for sustained daily stamina and
                    natural immunity.
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between gap-2 pt-4 md:pt-6 border-t border-emerald-900/30">
                  <div>
                    <span className="text-[10px] md:text-xs text-[#F5F2EB]/40 line-through block">
                      {isFranchise ? "₹1,499" : "₹1,499"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-lg md:text-2xl font-bold text-emerald-400">
                        {isFranchise ? "₹999" : "₹1,199"}
                      </span>
                      {isFranchise && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">
                          B2B Rate
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/products?category=Combos"
                    className="magnetic-btn inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-[#0B1310] px-4 py-2.5 md:px-5 md:py-3 text-[11px] md:text-sm font-bold transition-transform hover:scale-105 shrink-0"
                  >
                    Explore <span className="hidden sm:inline">Bundle</span>{" "}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* BUNDLE 2 */}
            <div className="group relative rounded-[2rem] md:rounded-[2.5rem] bg-[#121E1A] border border-emerald-900/30 shadow-lg transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:border-emerald-500/30 flex flex-col overflow-hidden shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center">
              <div className="relative h-44 sm:h-52 md:h-[22rem] w-full overflow-hidden bg-[#080D0A]">
                <div className="absolute top-4 right-4 md:top-5 md:right-5 bg-emerald-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full z-30 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  Save 15%
                </div>
                <img
                  src={comboOilPowder}
                  alt="Oils and Powders"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="p-5 md:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-400/60">
                    Pure Heritage Care
                  </span>
                  <h3 className="font-serif text-xl md:text-3xl text-white mt-1.5 mb-2 md:mt-2 md:mb-3">
                    Ayurvedic Oils & Powders
                  </h3>
                  <p className="text-[#F5F2EB]/60 text-xs md:text-base mb-4 md:mb-6 leading-relaxed line-clamp-2">
                    Experience traditional care with therapeutic herbal massage
                    oils and cleansing organic botanical powders for complete
                    restoration.
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between gap-2 pt-4 md:pt-6 border-t border-emerald-900/30">
                  <div>
                    <span className="text-[10px] md:text-xs text-[#F5F2EB]/40 line-through block">
                      {isFranchise ? "₹1,899" : "₹1,899"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-lg md:text-2xl font-bold text-emerald-400">
                        {isFranchise ? "₹1199" : "₹1,599"}
                      </span>
                      {isFranchise && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">
                          B2B Rate
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/products?category=Combos"
                    className="magnetic-btn inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-[#0B1310] px-4 py-2.5 md:px-5 md:py-3 text-[11px] md:text-sm font-bold transition-transform hover:scale-105 shrink-0"
                  >
                    Explore <span className="hidden sm:inline">Bundle</span>{" "}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* GLOBAL EXCELLENCE SECTION (REDUCED MOBILE PADDING) */}
        {/* ===================================================== */}
        {/* 🌟 FIX: mb-12 to mb-8 for mobile spacing */}
        <div className="w-full max-w-7xl mx-auto mb-8 reveal-on-scroll">
          <GlobalExcellence />
          <GlobalShipping />
        </div>

        {/* 🌟 FIX: mb-8 instead of mb-12 for mobile */}
        <div className="w-full max-w-7xl mx-auto mb-8 reveal-on-scroll">
          <Certificates />
          <StandardsCTA />
        </div>

        {/* ===================================================== */}
        {/* 4. CTA SECTION (Dark Theme) */}
        {/* ===================================================== */}
        <div className="w-full max-w-6xl bg-[#121E1A] p-8 rounded-[2rem] md:rounded-[3rem] border border-emerald-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] reveal-on-scroll grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-10 md:mb-24 text-center md:text-left">
          <div>
            <span className="eyebrow inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/80">
              For Growing Brands
            </span>
            <h2 className="mt-2 md:mt-3 font-serif text-3xl md:text-4xl text-white">
              Build your Ayurvedic brand with us.
            </h2>
            <p className="mt-3 md:mt-5 text-sm md:text-base leading-relaxed text-[#F5F2EB]/60">
              From private label and bulk manufacturing to custom product
              development and packaging support, create products that belong to
              your brand.
            </p>
            <Link
              to="/quote"
              className="mt-6 md:mt-8 inline-flex items-center justify-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              Request a Quote <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 w-full mt-4 md:mt-0">
            {[
              { icon: <Factory size={20} />, title: "Private Label" },
              { icon: <Leaf size={20} />, title: "Formulation" },
              { icon: <ShieldCheck size={20} />, title: "Quality Focus" },
              { icon: <Sparkles size={20} />, title: "Packaging" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#080D0A] p-4 sm:p-6 rounded-2xl border border-emerald-900/40 flex flex-col items-center gap-2 sm:gap-3 transition hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] group text-center w-full"
              >
                <div className="text-emerald-500 group-hover:text-emerald-400 transition-colors shrink-0">
                  {feature.icon}
                </div>
                <span className="font-serif text-sm sm:text-lg text-white">
                  {feature.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================== */}
        {/* 5. FINAL CTA (Dark Theme - Glowing) */}
        {/* ===================================================== */}
        <div className="w-full max-w-6xl bg-[#0B1310] rounded-[2rem] md:rounded-[3rem] p-8 text-center shadow-[0_0_60px_rgba(16,185,129,0.05)] border border-emerald-900/20 reveal-on-scroll relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 -translate-x-1/4 translate-y-1/4 w-48 h-48 md:w-64 md:h-64 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none" />
          <span className="relative z-10 eyebrow inline-block text-[11px] md:text-[15px] font-bold uppercase tracking-[0.3em] text-emerald-400/60">
            Start a conversation
          </span>
          <h2 className="relative z-10 mt-3 md:mt-4 font-serif text-3xl sm:text-4xl md:text-6xl text-white">
            Have a product idea?
            <br />
            <span className="italic font-normal text-emerald-100/70">
              Let's build it.
            </span>
          </h2>
          <Link
            to="/quote"
            className="magnetic-btn relative z-10 mt-8 md:mt-12 inline-flex items-center gap-2 md:gap-3 bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-3.5 md:px-10 md:py-5 text-sm md:text-xl font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] rounded-full transition-all"
          >
            Get in Touch{" "}
            <ArrowRight size={20} className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
