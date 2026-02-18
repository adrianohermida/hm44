import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, FileText, MessageSquare, DollarSign, Calendar, Folder, CreditCard, LogOut, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function ClienteSidebar({ user, stats = {}, isCollapsed = false }) {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState("cliente");

  const menuItems = [
    { 
      id: "cliente",
      label: "Meu Painel",
      icon: null,
      children: [
        { label: "Visão Geral",      icon: FileText,   path: createPageUrl("MeuPainel"),              badge: null },
        { label: "Meus Processos",   icon: FileText,   path: createPageUrl("MeuPainel") + "?tab=processos", badge: stats?.processos },
        { label: "Suporte",          icon: MessageSquare, path: createPageUrl("MeuPainel") + "?tab=tickets", badge: stats?.tickets },
        { label: "Comunicação",      icon: MessageSquare, path: createPageUrl("Comunicacao") },
        { label: "Faturas",          icon: DollarSign, path: createPageUrl("MeuPainel") + "?tab=faturas" },
        { label: "Documentos",       icon: Folder,     path: createPageUrl("MeuPainel") + "?tab=documentos" },
        { label: "Plano de Pagamento", icon: CreditCard, path: createPageUrl("MeuPainel") + "?tab=pagamento" },
        { label: "Minha Agenda",     icon: Calendar,   path: createPageUrl("MeuPainel") + "?tab=agenda" },
      ]
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl("Home"));
  };

  const handleExport = async () => {
    const data = { usuario: user };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meus-dados-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isCollapsed) {
    return (
      <div className="hidden lg:flex w-16 bg-[var(--bg-elevated)] border-r border-[var(--border-primary)] flex-col items-center py-4 space-y-6">
        <img
          src={user?.foto_url || user?.avatar_url || user?.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=10b981&color=fff&size=40`}
          alt={user?.full_name}
          className="w-10 h-10 rounded-full object-cover shadow-md"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=10b981&color=fff&size=40`;
          }}
        />
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Sair"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex w-64 bg-[var(--bg-elevated)] border-r border-[var(--border-primary)] flex-col h-full overflow-hidden shadow-sm">
      {/* Profile Section */}
      <div className="p-5 border-b border-[var(--border-primary)] space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={user?.foto_url || user?.avatar_url || user?.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=10b981&color=fff&size=56`}
            alt={user?.full_name}
            className="w-14 h-14 rounded-full object-cover shadow-md ring-2 ring-[var(--brand-primary)]"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=10b981&color=fff&size=56`;
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {user?.full_name}
            </p>
            <p className="text-xs text-[var(--text-secondary)] font-medium">PORTAL DO CLIENTE</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-2 text-xs font-medium hover:bg-[var(--bg-secondary)]"
          onClick={handleExport}
        >
          <Download className="w-4 h-4" />
          EXPORTAR DADOS
        </Button>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[var(--brand-primary)] scrollbar-track-[var(--bg-tertiary)]">
        {menuItems.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => setExpandedSection(
                expandedSection === section.id ? null : section.id
              )}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--brand-primary)]/5 transition-colors active:bg-[var(--brand-primary)]/10"
            >
              {section.label}
              {section.children && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSection === section.id ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {section.children && expandedSection === section.id && (
              <div className="space-y-1 mt-2 ml-1 border-l-2 border-[var(--brand-primary)]/20">
                {section.children.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--brand-primary)]/5 transition-colors active:bg-[var(--brand-primary)]/10"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <item.icon className="w-4 h-4 flex-shrink-0 text-[var(--brand-primary)]" />
                      <span className="truncate font-medium">{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-[var(--brand-primary)] text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 min-w-fit">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border-primary)] p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 gap-2 font-medium"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}