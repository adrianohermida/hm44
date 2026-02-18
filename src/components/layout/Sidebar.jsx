import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose, menuItems = [] }) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b lg:justify-center">
          <h2 className="text-xl font-bold text-[var(--brand-primary)]">LegalFlow</h2>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={createPageUrl(item.page)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--brand-primary-50)] transition-colors"
            >
              {item.icon}
              <span className="font-medium text-[var(--brand-text-primary)]">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}