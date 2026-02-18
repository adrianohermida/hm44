import React from 'react';

export default function HeroStatsBar({ stats }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="mt-8 sm:mt-10 md:mt-12">
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 px-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="flex items-center gap-2 sm:gap-3 min-w-[140px] sm:min-w-0"
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--brand-primary)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--brand-primary)]">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-[var(--text-secondary)] leading-tight">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}