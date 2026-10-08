import { useState } from "react";
import {
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import FSMS from "../assets/certificates/fsms-cert.png";
import FDA from "../assets/certificates/fda-cert.png";
import GMP from "../assets/certificates/gmp-cert.png";
import HACCP from "../assets/certificates/haccp-cert.png";
import ISO from "../assets/certificates/iso-cert.png";

const certificates = [
  {
    title: "FSMS",
    subtitle: "Food Safety Management System",
    description:
      "ISO 22000:2018 certified for rigorous food and supplement safety standards.",
    image: FSMS,
  },
  {
    title: "FDA Registration",
    subtitle: "US FDA Compliance",
    description:
      "Registered facility meeting strict U.S. FDA regulations for export-ready manufacturing.",
    image: FDA,
  },
  {
    title: "GMP Certified",
    subtitle: "Good Manufacturing Practice",
    description:
      "Certified for maintaining optimal hygiene, quality control, and production standards.",
    image: GMP,
  },
  {
    title: "ISO 9001:2015",
    subtitle: "Quality Management System",
    description:
      "Internationally recognized standard for consistent quality and customer satisfaction.",
    image: ISO,
  },
  {
    title: "HACCP",
    subtitle: "Hazard Analysis Critical Control Point",
    description:
      "Systematic preventive approach to food safety from biological, chemical, and physical hazards.",
    image: HACCP,
  },
];

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section className="py-8 pb-0 bg-[#080D0A] text-[#F5F2EB] overflow-hidden">
      {/* 🌟 Yahan sirf py-8 hai, matlab top aur bottom dono taraf 8 padding */}

      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Award size={12} /> Certifications & Compliance
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Certificates
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#F5F2EB]/60 leading-relaxed">
            Verified quality standards that support export-ready manufacturing
            across global markets. Swipe to explore & click to view.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative group px-2 sm:px-6">
          <Swiper
            modules={[FreeMode, Navigation, Pagination]}
            freeMode={true}
            grabCursor={true}
            spaceBetween={16}
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 14 },
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            navigation={{ nextEl: ".cert-next", prevEl: ".cert-prev" }}
            pagination={{ clickable: true, dynamicBullets: true }}
            style={{
              "--swiper-pagination-color": "#34D399",
              "--swiper-pagination-bullet-inactive-color":
                "rgba(52, 211, 153, 0.2)",
              "--swiper-pagination-bullet-inactive-opacity": "1",
            }}
            className="!pb-14"
          >
            {certificates.map((cert, idx) => (
              <SwiperSlide key={idx} className="!h-auto">
                <div
                  onClick={() => setSelectedCert(cert)}
                  className="h-full bg-[#121E1A] border border-emerald-900/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 group/card cursor-pointer"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#080D0A] border border-emerald-900/60 flex items-center justify-center text-emerald-400 mb-6 shadow-inner group-hover/card:scale-110 transition-transform">
                      <ShieldCheck size={24} strokeWidth={1.5} />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70 block mb-1">
                      {cert.subtitle}
                    </span>
                    <h3 className="text-xl font-serif text-white mb-3">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-[#F5F2EB]/60 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-900/30 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                    <span>Click to View</span>
                    <ExternalLink
                      size={14}
                      className="opacity-70 group-hover/card:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="hidden md:flex cert-prev absolute left-0 top-[42%] -translate-y-1/2 -translate-x-4 z-20 w-11 h-11 items-center justify-center rounded-full bg-[#121E1A] border border-emerald-500/30 shadow-lg text-emerald-400 transition-all hover:bg-emerald-600 hover:text-white hover:scale-110 cursor-pointer">
            <ChevronLeft size={22} />
          </button>
          <button className="hidden md:flex cert-next absolute right-0 top-[42%] -translate-y-1/2 translate-x-4 z-20 w-11 h-11 items-center justify-center rounded-full bg-[#121E1A] border border-emerald-500/30 shadow-lg text-emerald-400 transition-all hover:bg-emerald-600 hover:text-white hover:scale-110 cursor-pointer">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* POPUP / MODAL FOR CERTIFICATE VIEW */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#121E1A] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#080D0A] border border-emerald-900/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Wrapper me pr-14 (padding-right) diya taaki text close button se na takraye */}
            <div className="pr-14">
              <span className="block text-xs font-bold uppercase tracking-widest text-emerald-400 leading-snug">
                {selectedCert.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif mt-1.5 mb-4">
                {selectedCert.title} Certificate
              </h3>
            </div>

            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#080D0A] border border-emerald-900/40 mb-6 flex items-center justify-center">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="w-full h-full object-contain p-2"
              />
            </div>

            <p className="text-xs sm:text-sm text-[#F5F2EB]/70 leading-relaxed mb-6">
              {selectedCert.description}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
