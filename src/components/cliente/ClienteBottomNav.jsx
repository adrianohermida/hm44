import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, FileText, MessageSquare, Calendar } from "lucide-react";

export default function ClienteBottomNav({ user, stats }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home",      label: "Início",    icon: Home,         path: createPageUrl("MeuPainel") },
    { id: "processos", label: "Processos", icon: FileText,     path: createPageUrl("MeusProcessos"), badge: stats?.processos },
    { id: "tickets",   label: "Suporte",   icon: MessageSquare, path: createPageUrl("MeusTickets"),  badge: stats?.tickets },
    { id: "agenda",    label: "Agenda",    icon: Calendar,     path: createPageUrl("MinhaAgenda") },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (item) => {
    if (item.id === 'home') {
      return location.pathname.includes('MeuPainel') && !location.pathname.includes('MeuPlanoPagamento');
    }
    return location.pathname.includes(item.path.replace(/^\//, '').split('?')[0]);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border-primary)] shadow-lg z-30 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.path)}
            className={`flex flex-col items-center justify-center py-3 px-3 flex-1 transition-all active:scale-95 relative min-h-[64px] ${
              isActive(item)
                ? "text-[var(--brand-primary)]"
                : "text-[var(--text-secondary)]"
            }`}
            aria-label={item.label}
            aria-current={isActive(item) ? "page" : undefined}
          >
            <item.icon className={`w-6 h-6 mb-1 transition-colors ${
              isActive(item) ? "text-[var(--brand-primary)]" : "text-inherit"
            }`} />
            <span className="text-xs font-semibold">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="absolute top-1 right-0.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}