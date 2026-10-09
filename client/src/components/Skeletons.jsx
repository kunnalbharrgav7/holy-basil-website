import React from 'react';

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full bg-[#121E1A] rounded-2xl border border-emerald-900/30 overflow-hidden animate-pulse">
      <div className="flex border-b border-emerald-900/40 bg-[#0B1310] p-4">
        {[...Array(columns)].map((_, i) => (
          <div key={i} className="h-4 bg-emerald-900/40 rounded flex-1 mx-2"></div>
        ))}
      </div>
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex border-b border-emerald-900/20 p-4">
          {[...Array(columns)].map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-emerald-900/20 rounded flex-1 mx-2"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-[#121E1A] p-6 rounded-2xl border border-emerald-900/30 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="h-4 w-1/2 bg-emerald-900/30 rounded"></div>
            <div className="h-10 w-10 bg-emerald-900/40 rounded-xl"></div>
          </div>
          <div className="h-8 w-3/4 bg-emerald-900/40 rounded mb-2"></div>
          <div className="h-3 w-1/4 bg-emerald-900/20 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-[#121E1A] rounded-[2.5rem] border border-emerald-900/30"></div>
        <div className="flex flex-col pt-8">
          <div className="h-4 w-1/4 bg-emerald-900/40 rounded mb-4"></div>
          <div className="h-10 w-3/4 bg-emerald-900/40 rounded mb-6"></div>
          <div className="h-6 w-1/3 bg-emerald-900/30 rounded mb-8"></div>
          <div className="space-y-3 mb-10">
            <div className="h-4 bg-emerald-900/20 rounded w-full"></div>
            <div className="h-4 bg-emerald-900/20 rounded w-full"></div>
            <div className="h-4 bg-emerald-900/20 rounded w-5/6"></div>
          </div>
          <div className="h-16 bg-[#121E1A] rounded-2xl border border-emerald-900/30 w-full"></div>
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-2xl bg-[#121E1A] border border-emerald-900/30 p-2 shadow-sm animate-pulse"
        >
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-emerald-900/20 mb-3" />
          <div className="px-2 pb-2 space-y-2">
            <div className="h-5 w-1/2 bg-emerald-900/40 rounded"></div>
            <div className="h-3 w-3/4 bg-emerald-900/20 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
}
