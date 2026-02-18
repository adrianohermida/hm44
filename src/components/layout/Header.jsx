import React from 'react';
import { Menu, Bell } from 'lucide-react';

export default function Header({ onMenuClick, title }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-[var(--brand-text-primary)]">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5 text-[var(--brand-text-secondary)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--brand-error)] rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}