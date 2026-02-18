import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClienteHeaderUser({ user }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl("Home"));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors hidden sm:flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--brand-primary)]">
          {user?.full_name?.charAt(0)}
        </div>
        <Menu className="w-5 h-5 text-[var(--text-primary)]" />
      </button>

      {/* Desktop Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-[var(--border-primary)]">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.full_name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              navigate(createPageUrl("Profile"));
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="text-sm">Perfil</span>
          </button>
          <button
            onClick={() => {
              navigate(createPageUrl("Settings"));
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Configurações</span>
          </button>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-[var(--border-primary)]"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors sm:hidden"
      >
        {menuOpen ? (
          <X className="w-5 h-5 text-[var(--text-primary)]" />
        ) : (
          <Menu className="w-5 h-5 text-[var(--text-primary)]" />
        )}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden absolute right-0 mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-[var(--border-primary)]">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.full_name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              navigate(createPageUrl("Profile"));
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-primary)]"
          >
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Perfil</span>
          </button>
          <button
            onClick={() => handleLogout()}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}