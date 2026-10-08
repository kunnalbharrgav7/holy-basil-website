import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex min-w-0 items-center gap-2.5 group"
      aria-label="Holy Basil Ayurveda"
    >
      {/* 🌟 Dark Theme Icon Wrapper (Glowing Emerald) */}
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-emerald-500/30 bg-emerald-900/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-colors group-hover:border-emerald-400/50 group-hover:bg-emerald-800/30 sm:h-10 sm:w-10">
        <Leaf
          size={18}
          strokeWidth={1.7}
          className="text-emerald-400 sm:h-[19px] sm:w-[19px]"
        />
      </span>

      <span className="min-w-0 leading-none">
        {/* 🌟 Bright White Text for Brand Name */}
        <strong className="block whitespace-nowrap font-display text-[20px] font-semibold tracking-tight text-white transition-colors group-hover:text-emerald-50 sm:text-[22px]">
          Holy Basil
        </strong>

        {/* 🌟 Glowing Emerald for Subtitle */}
        <small className="mt-1 block whitespace-nowrap text-[7px] font-bold uppercase tracking-[0.28em] text-emerald-400/80 sm:text-[8px] sm:tracking-[0.32em]">
          Ayurveda
        </small>
      </span>
    </Link>
  );
}
