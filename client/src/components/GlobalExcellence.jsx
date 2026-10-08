import {
  ShieldCheck,
  PackageOpen,
  Globe2,
  Truck,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    title: "Quality Assured",
    desc: "Controlled for purity, safety, and consistency.",
    icon: ShieldCheck,
  },
  {
    title: "Excellent Packaging",
    desc: "Secure, attractive, and export-friendly.",
    icon: PackageOpen,
  },
  {
    title: "Widespread Distribution",
    desc: "Built for strong global market reach.",
    icon: Globe2,
  },
  {
    title: "Well-managed Logistics",
    desc: "Reliable supply chain and delivery.",
    icon: Truck,
  },
];

export default function GlobalExcellence() {
  return (
    <section className="py-8 bg-[#080D0A] text-[#F5F2EB] overflow-hidden">
      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side: Content & Features */}
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                What Makes Us Special
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight">
                Global Excellence in <br />
                <span className="text-emerald-400">
                  Supplement Manufacturing
                </span>
              </h2>
              <p className="mt-4 text-[#F5F2EB]/60 leading-relaxed text-sm sm:text-base max-w-lg">
                Holy Basil Ayurveda stands apart as India's No.1 manufacturer of
                premium herbal supplements. We combine advanced technology and
                strict quality standards to deliver world-class solutions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-[#121E1A] p-5 rounded-2xl border border-emerald-900/30 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#080D0A] border border-emerald-900/50 flex items-center justify-center mb-4 text-emerald-400">
                    <feature.icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-serif text-base mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#F5F2EB]/50 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Orbital Graphic with strict containment */}
          <div className="relative w-full overflow-hidden flex items-center justify-center py-6 lg:py-0">
            {/* Scale wrapper: Scales down cleanly on mobile (scale-[0.62]) and normal on desktop (lg:scale-100) */}
            <div className="scale-[0.62] sm:scale-[0.8] lg:scale-100 transition-transform my-2 origin-center">
              <div
                className="relative shrink-0 flex items-center justify-center rounded-full"
                style={{ width: "360px", height: "360px" }}
              >
                {/* Rings */}
                <div className="absolute inset-0 border border-emerald-900/40 rounded-full animate-[spin_60s_linear_infinite] border-dashed" />
                <div className="absolute inset-[10%] border border-emerald-900/30 rounded-full" />
                <div className="absolute inset-[22%] border border-emerald-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                <div className="absolute inset-[34%] border border-emerald-900/50 rounded-full" />

                {/* Center Globe Core */}
                <div
                  className="relative z-10 rounded-full bg-gradient-to-br from-emerald-600 to-[#0B1310] shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center border-4 border-[#080D0A]"
                  style={{ width: "110px", height: "110px" }}
                >
                  <Globe2
                    size={28}
                    className="text-white mb-1 opacity-90 drop-shadow-md"
                    strokeWidth={1.5}
                  />
                  <span className="font-bold text-white tracking-widest text-[9px] text-center leading-tight drop-shadow-md">
                    HOLY BASIL
                    <br />
                    <span className="text-[6px] opacity-70">AYURVEDA</span>
                  </span>
                </div>

                {/* Floating Badges with safe inner margins */}
                <div
                  className="absolute z-20 bg-[#121E1A] border border-emerald-900/50 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg whitespace-nowrap"
                  style={{ top: "2px", right: "10px" }}
                >
                  <span className="text-emerald-400 font-bold text-base leading-none">
                    25+
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#F5F2EB]/70 leading-none text-left">
                    Global
                    <br />
                    Markets
                  </span>
                </div>

                <div
                  className="absolute z-20 bg-[#121E1A] border border-emerald-900/50 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg whitespace-nowrap"
                  style={{ bottom: "5px", left: "10px" }}
                >
                  <span className="text-emerald-400 font-bold text-base leading-none">
                    100+
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#F5F2EB]/70 leading-none text-left">
                    Premium
                    <br />
                    Products
                  </span>
                </div>

                <div
                  className="absolute z-20 bg-[#080D0A] border border-emerald-500/30 rounded-full px-2.5 py-1.5 flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                  style={{ top: "18%", left: "5px" }}
                >
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-semibold text-white">
                    Quality
                  </span>
                </div>

                <div
                  className="absolute z-20 bg-[#080D0A] border border-emerald-500/30 rounded-full px-2.5 py-1.5 flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                  style={{
                    top: "50%",
                    right: "5px",
                    transform: "translateY(-50%)",
                  }}
                >
                  <PackageOpen size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-semibold text-white">
                    Packaging
                  </span>
                </div>

                <div
                  className="absolute z-20 bg-[#080D0A] border border-emerald-500/30 rounded-full px-2.5 py-1.5 flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                  style={{ bottom: "18%", right: "15px" }}
                >
                  <Truck size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-semibold text-white">
                    Logistics
                  </span>
                </div>

                {/* Accent Dots */}
                <div
                  className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399] animate-pulse"
                  style={{ top: "22%", right: "22%" }}
                ></div>
                <div
                  className="absolute w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#34d399] animate-pulse delay-75"
                  style={{ bottom: "34%", left: "34%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
