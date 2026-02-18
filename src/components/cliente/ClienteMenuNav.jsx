import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, MessageSquare, DollarSign, Calendar, Folder, CreditCard, LayoutGrid } from "lucide-react";

export default function ClienteMenuNav({ activeTab, onTabChange, stats }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutGrid },
    { id: 'processos', label: 'Meus Processos', icon: FileText, count: stats?.processos || 0 },
    { id: 'tickets', label: 'Suporte', icon: MessageSquare, count: stats?.tickets || 0 },
    { id: 'faturas', label: 'Faturas', icon: DollarSign },
    { id: 'documentos', label: 'Documentos', icon: Folder },
    { id: 'pagamento', label: 'Plano de Pagamento', icon: CreditCard },
    { id: 'agenda', label: 'Minha Agenda', icon: Calendar, count: stats?.consultas || 0 }
  ];

  const handleClick = (item) => {
    onTabChange(item.id);
  };

  return (
    <nav className="space-y-1 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)] p-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[var(--brand-primary)] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.count !== undefined && item.count > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-white/20' 
                  : 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}