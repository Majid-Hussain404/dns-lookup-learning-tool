import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Summary Header Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-64 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-6 w-20 bg-slate-300 dark:bg-slate-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-between px-4"
            >
              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
