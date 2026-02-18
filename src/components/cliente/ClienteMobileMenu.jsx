import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, FileText, MessageSquare, DollarSign, Calendar, Folder, Copy, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function ClienteMobileMenu({ user, stats }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Visão Geral", icon: Home, path: "MeuPainel" },
    { label: "Meus Processos", icon: FileText, path: "MeusProcessos", badge: stats?.processos },
    { label: "Suporte", icon: MessageSquare, path: "MeusTickets", badge: stats?.tickets },
    { label: "Faturas", icon: DollarSign, path: "MinhasFaturas" },
    { label: "Documentos", icon: Folder, path: "MeusDocumentos" },
    { label: "Plano de Pagamento", icon: Copy, path: "MeuPlanoPagamento" },
    { label: "Minha Agenda", icon: Calendar, path: "MinhaAgenda", badge: stats?.consultas }
  ];

  const handleNavigate = (path) => {
    navigate(createPageUrl(path));
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl("Home"));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-20 right-4 z-40 p-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors shadow-md border border-[var(--border-primary)] active:scale-95"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6 text-[var(--text-primary)]" />
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div className="lg:hidden fixed top-0 right-0 h-full w-80 bg-[var(--bg-primary)] z-50 transition-transform duration-300 shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 p-5 border-b border-[var(--border-primary)] bg-[var(--bg-elevated)] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors active:scale-95"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.full_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {user?.full_name}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-[var(--bg-secondary)] active:bg-[var(--brand-primary)]/10 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <item.icon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] flex-shrink-0" />
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {item.label}
                </span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border-primary)] p-4 space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-sm"
            onClick={() => {
              handleNavigate("Profile");
            }}
          >
            <Settings className="w-4 h-4" />
            Meu Perfil
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
          >
            <X className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </>
  );
}