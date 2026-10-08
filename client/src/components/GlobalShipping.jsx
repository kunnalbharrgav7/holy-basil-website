import { Globe, Truck, ShieldCheck, Navigation } from "lucide-react";

export default function GlobalShipping() {
  return (
    // 🌟 FIX: padding reduced to exactly py-8 for all viewports
    <section className="py-8 bg-[#080D0A] text-[#F5F2EB] overflow-hidden">
      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#121E1A] to-[#080D0A] border border-emerald-900/40 p-8 overflow-hidden shadow-2xl">
          {/* Background Grid & Glow Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none"></div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Globe size={12} /> Global Shipping Network
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight">
                Shipping Across <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  100+ Countries
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#F5F2EB]/60 leading-relaxed max-w-lg">
                Shipping premium dietary supplements to 100+ countries with
                reliability, efficiency, and adherence to the highest global
                quality standards.
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs sm:text-sm font-medium text-emerald-400">
                <ShieldCheck size={18} />
                <span>Trusted Worldwide Distribution Network</span>
              </div>
            </div>

            {/* Right Side: Responsive Global World Map & Globe Visual */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#050807] rounded-3xl border border-emerald-900/50 p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-inner">
              {/* World Map Background Silhouette */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15"></div>

              {/* Glowing Arcs */}
              <div className="absolute w-[220px] h-[220px] sm:w-[360px] sm:h-[360px] border border-emerald-500/10 rounded-full animate-[spin_50s_linear_infinite]"></div>
              <div className="absolute w-[150px] h-[150px] sm:w-[260px] sm:h-[260px] border border-dashed border-emerald-400/20 rounded-full animate-[spin_35s_linear_infinite_reverse]"></div>

              {/* Central Glowing Globe Core */}
              <div className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-500/30 to-[#080D0A] border border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.25)] flex flex-col items-center justify-center">
                <Globe
                  size={24}
                  className="sm:w-10 sm:h-10 text-emerald-400 animate-pulse mb-0.5"
                  strokeWidth={1.5}
                />
                <div className="absolute -bottom-2.5 bg-emerald-600 text-white text-[7px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider whitespace-nowrap z-20">
                  Global Hub
                </div>
              </div>

              {/* Floating Route Nodes / Pins */}

              {/* Top-Left: Export Ready */}
              <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex items-center gap-1 bg-[#121E1A]/95 backdrop-blur-md border border-emerald-500/30 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-lg z-20">
                <Navigation
                  size={10}
                  className="text-emerald-400 animate-bounce"
                />
                <span className="text-[8px] sm:text-[10px] font-semibold text-white">
                  Export Ready
                </span>
              </div>

              {/* Bottom-Left: On-Time Dispatch */}
              <div className="absolute left-3 bottom-3 sm:left-6 sm:bottom-6 bg-[#121E1A]/95 backdrop-blur-md border border-emerald-500/30 rounded-xl p-2 sm:p-3.5 shadow-xl z-20 max-w-[110px] sm:max-w-none">
                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 block leading-tight">
                  On-Time
                </span>
                <span className="text-[8px] sm:text-[10px] text-[#F5F2EB]/60">
                  Global Dispatch
                </span>
              </div>

              {/* Top-Right: Countries Served */}
              <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-[#121E1A]/95 backdrop-blur-md border border-emerald-500/30 rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 shadow-xl text-center z-20">
                <span className="text-sm sm:text-xl font-serif font-bold text-white block leading-none">
                  100+
                </span>
                <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-emerald-400 font-semibold mt-0.5 block">
                  Countries Served
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
