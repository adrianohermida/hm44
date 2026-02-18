import React from 'react';
import { cn } from '@/lib/utils';

export default function HelpdeskSidebarItem({ icon: Icon, label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
        active 
          ? "bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]" 
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium",
          active 
            ? "bg-[var(--brand-primary)] text-white" 
            : "bg-gray-200 text-gray-600"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}