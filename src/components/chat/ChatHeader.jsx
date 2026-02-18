import React from 'react';
import { MessageCircle, X, Minimize2, Maximize2, Scale } from 'lucide-react';

export default function ChatHeader({ isMinimized, onToggleMinimize, onClose }) {
  return (
    <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-600)] text-[var(--text-on-primary)] p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Dr. Adriano Hermida Maia</h3>
          <p className="text-xs opacity-90">Assistente Jurídico IA • Online</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMinimize}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          aria-label={isMinimized ? "Maximizar" : "Minimizar"}
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Fechar chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}