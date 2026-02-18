import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Scale, Menu, X, Phone } from 'lucide-react';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export default function LandingHeaderV2({ currentUser, onLogin, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-primary)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-[var(--text-primary)]">Dr. Adriano Hermida Maia</h1>
              <p className="text-xs text-[var(--text-secondary)]">Defesa do Devedor</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            
            <a 
              href="https://wa.me/5551996032004" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--brand-success)] hover:bg-[#0d9c6e] text-white rounded-lg font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>

            {currentUser ? (
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <CustomAvatar 
                  src={currentUser.avatar} 
                  alt={currentUser.full_name} 
                  fallback={currentUser.full_name?.charAt(0) || 'U'} 
                  className="w-8 h-8 ring-2 ring-[var(--brand-primary)]"
                />
                <span className="hidden md:block text-sm font-medium text-[var(--text-primary)]">{currentUser.full_name?.split(' ')[0]}</span>
              </button>
            ) : (
              <button onClick={onLogin} className="px-4 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white rounded-lg font-semibold transition-colors">
                Entrar
              </button>
            )}

            <button onClick={() => setOpen(!open)} className="md:hidden p-2">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--bg-primary)] border-t border-[var(--border-primary)] px-4 py-4 space-y-2">
          <Link to={createPageUrl('About')} className="block py-2 text-[var(--text-primary)]">Sobre</Link>
          <Link to={createPageUrl('Contact')} className="block py-2 text-[var(--text-primary)]">Contato</Link>
        </div>
      )}
    </nav>
  );
}