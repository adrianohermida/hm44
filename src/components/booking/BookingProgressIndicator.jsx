import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function BookingProgressIndicator({ currentStep, theme }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
        currentStep >= 0 
          ? "bg-[#0d9c6e] text-white" 
          : theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-gray-200 text-gray-400'
      )}>
        1
      </div>
      <div className={cn(
        "h-px flex-1 transition-all", 
        currentStep >= 1 
          ? "bg-[#0d9c6e]" 
          : theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
      )} />
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
        currentStep >= 1 
          ? "bg-[#0d9c6e] text-white" 
          : theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-gray-200 text-gray-400'
      )}>
        2
      </div>
      <div className={cn(
        "h-px flex-1 transition-all", 
        currentStep >= 2 
          ? "bg-[#0d9c6e]" 
          : theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
      )} />
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
        currentStep >= 2 
          ? "bg-[#0d9c6e] text-white" 
          : theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-gray-200 text-gray-400'
      )}>
        3
      </div>
    </div>
  );
}