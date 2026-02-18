import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Users, FileText, Inbox, Menu, X, BarChart3, MessageSquare, DollarSign, Sparkles, TrendingUp, Settings, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { Button } from '@/components/ui/button';

const mainNavItems = [
  { id: 'visao', icon: Home, label: 'Visão', url: createPageUrl('Dashboard') },
  { id: 'pessoas', icon: Users, label: 'Pessoas', url: createPageUrl('Pessoas') },
  { id: 'processos', icon: FileText, label: 'Processos', url: createPageUrl('Processos') },
  { id: 'inbox', icon: Inbox, label: 'Inbox', url: createPageUrl('Helpdesk') },
];

export default function MobileBottomNav({ currentUser, onLogout }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (url) => location.pathname === url || location.pathname.includes(url.split('?')[0]);

  const adminMenuItems = [
    { label: 'Dashboard', url: createPageUrl('Dashboard'), icon: BarChart3 },
    { label: 'Comunicação', url: createPageUrl('Comunicacao'), icon: MessageSquare },
    { label: 'Financeiro', url: createPageUrl('Financeiro'), icon: DollarSign },
    { label: 'Marketing', url: createPageUrl('Marketing'), icon: Sparkles },
    { label: 'Relatórios', url: createPageUrl('Relatorios'), icon: TrendingUp },
    { label: 'Configurações', url: createPageUrl('Escritorio'), icon: Settings },
  ];

  const userMenuItems = [
    { label: 'Meu Painel', url: createPageUrl('MeuPainel'), icon: Home },
    { label: 'Minhas Consultas', url: createPageUrl('MinhasConsultas'), icon: Calendar },
    { label: 'Meus Tickets', url: createPageUrl('MeusTickets'), icon: MessageSquare },
    { label: 'Meu Perfil', url: createPageUrl('Profile'), icon: User },
  ];

  const menuItems = currentUser?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Menu Expandido */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <CustomAvatar
                src={currentUser?.avatar}
                alt={currentUser?.full_name}
                fallback={currentUser?.full_name?.charAt(0) || 'U'}
                className="h-10 w-10"
              />
              <div>
                <p className="font-semibold text-sm">{currentUser?.full_name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{currentUser?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                    isActive(item.url)
                      ? "bg-[var(--brand-primary)] text-white"
                      : "text-[var(--text-primary)] hover:bg-[var(--brand-primary-50)]"
                  )}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              Sair
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border-primary)] z-40">
        <div className="grid grid-cols-5 h-16">
          {mainNavItems.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive(item.url)
                  ? "text-[var(--brand-primary)]"
                  : "text-[var(--text-secondary)]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-[var(--text-secondary)]"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}