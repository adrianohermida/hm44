import React from 'react';
import { X } from 'lucide-react';
import HeaderNav from './HeaderNav';
import HeaderCTA from './HeaderCTA';

export default function HeaderMobile({ isOpen, onClose, links, currentUser, onLogin, mostrarBotao = true }) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-[var(--bg-primary)]">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
        <h2 className="font-bold text-[var(--text-primary)]">Menu</h2>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          aria-label="Fechar menu"
        >
          <X className="w-6 h-6 text-[var(--text-primary)]" />
        </button>
      </div>
      
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        <HeaderNav links={links} mobile />
        <HeaderCTA 
          currentUser={currentUser} 
          onLogin={onLogin} 
          mobile 
          mostrarBotaoLogin={mostrarBotao}
        />
      </div>
    </div>
  );
}