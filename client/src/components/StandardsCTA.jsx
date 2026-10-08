import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import GMP from "../assets/StandardCTA/GMP.png";
import AYUSHAPPROVED from "../assets/StandardCTA/AYUSHAPPROVED.png";
import ISO from "../assets/StandardCTA/ISO.png";
import FDA from "../assets/StandardCTA/FDA.png";
import FSSAI from "../assets/StandardCTA/FSSAI.png";

const standards = [
  {
    name: "AYUSH Approved",
    desc: "Government of India certified",
    badgeImg: AYUSHAPPROVED,
  },
  {
    name: "US FDA Compliant",
    desc: "International export standard",
    badgeImg: FDA,
  },
  {
    name: "FSSAI Licensed",
    desc: "Verified food safety authority",
    badgeImg: FSSAI,
  },
  {
    name: "GMP Certified",
    desc: "Good manufacturing practice",
    badgeImg: GMP,
  },
  {
    name: "ISO 9001:2015",
    desc: "Quality management system",
    badgeImg: ISO,
  },
];

export default function StandardsCTA() {
  return (
    // 🌟 FIX: Removed md:py-24, kept only py-8 for uniform spacing on all devices
    <section className="py-8 pb-0 bg-[#080D0A] text-[#F5F2EB] overflow-hidden">
      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <ShieldCheck size={12} /> Certifications & Compliance
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white">
            Globally Recognized{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Standards
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#F5F2EB]/60 leading-relaxed">
            We follow stringent quality systems and certifications to ensure
            export-ready, compliant manufacturing across international markets.
          </p>
        </div>

        {/* Circular Badge Grid (Optimized mobile size: w-20 h-20, desktop: sm:w-32 sm:h-32) */}
        <div className="flex sm:justify-center items-center gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-0 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {standards.map((std, idx) => (
            <div
              key={idx}
              className="shrink-0 flex flex-col items-center group cursor-pointer"
            >
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-white p-2 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 sm:border-4 border-emerald-900/40 group-hover:border-emerald-500 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden">
                <img
                  src={std.badgeImg}
                  alt={std.name}
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="font-serif text-[11px] sm:text-xs font-bold text-white mt-2.5 text-center group-hover:text-emerald-400 transition-colors">
                {std.name}
              </h4>
              <span className="text-[8px] sm:text-[9px] text-[#F5F2EB]/50 text-center mt-0.5 max-w-[90px] sm:max-w-[100px] leading-tight">
                {std.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
