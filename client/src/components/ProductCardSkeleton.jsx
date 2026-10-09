export default function ProductCardSkeleton() {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-900/30 bg-[#121E1A] p-2.5 sm:p-3 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative mb-3 sm:mb-4">
        <div className="block aspect-[4/4.5] w-full overflow-hidden rounded-xl bg-[#080D0A]" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col px-1 sm:px-2 pb-1 sm:pb-2">
        {/* Title */}
        <div className="h-4 sm:h-5 w-3/4 bg-emerald-900/40 rounded mb-2"></div>
        {/* Category */}
        <div className="h-3 sm:h-3 w-1/2 bg-emerald-900/20 rounded"></div>

        {/* BOTTOM ACTION ROW */}
        <div className="mt-auto pt-3 sm:pt-4 flex items-end justify-between gap-1 sm:gap-2">
          {/* Price Section */}
          <div className="flex flex-col items-start gap-1.5 min-w-0 flex-1">
            <div className="h-3 w-12 bg-emerald-900/30 rounded-sm mb-1"></div>
            <div className="h-5 w-16 bg-emerald-900/50 rounded-md"></div>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pb-0.5">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-emerald-900/30"></div>
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-900/40"></div>
          </div>
        </div>
      </div>
    </article>
  );
}

