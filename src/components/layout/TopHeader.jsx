import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Scale, Bell, Inbox, LogOut, Settings as SettingsIcon, User as UserIcon, Menu, X, Moon, Sun, MessageSquare, AlertCircle, Plus, Mail, FileText, Building2, Users, BarChart3 } from 'lucide-react';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';
import GlobalSearch from '@/components/search/GlobalSearch';
import GlobalSearchValidated from '@/components/search/GlobalSearchValidated';
import { base44 } from '@/api/base44Client';
import { useConversasPendentes } from '@/components/hooks/useConversasPendentes';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import ClienteMenuMobile from '@/components/cliente/ClienteMenuMobile';

export default function TopHeader({ currentUser, onLogout, sidebarCollapsed, onToggleSidebar, conversasPendentes: pendentesCount }) {
  const navigate = useNavigate();
  const [helpdeskMetrics, setHelpdeskMetrics] = React.useState(null);

  React.useEffect(() => {
    if (currentUser?.role === 'admin' && currentUser?.escritorio_id) {
      base44.entities.Ticket.filter({ escritorio_id: currentUser.escritorio_id })
        .then(tickets => {
          const abertos = tickets.filter(t => ['aberto', 'em_atendimento'].includes(t.status)).length;
          const vencidos = tickets.filter(t => {
            if (!t.data_vencimento_sla) return false;
            return new Date(t.data_vencimento_sla) < new Date() && !['resolvido', 'fechado'].includes(t.status);
          }).length;
          setHelpdeskMetrics({ abertos, vencidos });
        })
        .catch(() => setHelpdeskMetrics(null));
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await base44.auth.logout(createPageUrl("Home"));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleInboxClick = () => {
    navigate(createPageUrl("Helpdesk"));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-elevated)] shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        <div className="flex items-center gap-2">
          {/* Sidebar Toggle - Tablet/Desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hidden md:flex min-h-[44px] min-w-[44px]"
            aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>

          {/* Logo & Brand */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-3 flex-shrink-0" aria-label="Ir para página inicial">
            <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-bold text-[var(--brand-text-primary)] text-base leading-tight">Dr. Adriano Hermida Maia</h2>
              <p className="text-xs text-[var(--brand-text-secondary)]">Defesa do Superendividado</p>
            </div>
          </Link>
        </div>

        {/* Global Search - Admin only */}
        {currentUser?.role === 'admin' && (
          <div className="hidden md:flex flex-1 max-w-xl">
            <GlobalSearchValidated 
              escritorioId={currentUser?.escritorio_id}
              onResultClick={(result) => {
                if (result.url) {
                  navigate(result.url);
                }
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Global + Novo Button - Admin only */}
          {currentUser?.role === 'admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] h-9 gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">Novo</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate(createPageUrl('EnviarTicket'))}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ticket
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(createPageUrl('EnviarEmail'))}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(createPageUrl('Processos') + '?new=true')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Processo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(createPageUrl('Helpdesk') + '?new=message')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Mensagem
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(createPageUrl('Clientes') + '?new=pf')}>
                  <UserIcon className="w-4 h-4 mr-2" />
                  Contato (PF)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(createPageUrl('Clientes') + '?new=pj')}>
                  <Building2 className="w-4 h-4 mr-2" />
                  Empresa (PJ)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(createPageUrl('Usuarios') + '?new=agente')}>
                  <Users className="w-4 h-4 mr-2" />
                  Agente
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Helpdesk Mini Metrics - Admin only */}
          {currentUser?.role === 'admin' && helpdeskMetrics && (
            <div className="hidden lg:flex items-center gap-3 mr-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={handleInboxClick}>
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">{helpdeskMetrics.abertos}</span>
                <span className="text-xs text-blue-500">abertos</span>
              </div>
              {helpdeskMetrics.vencidos > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors" onClick={handleInboxClick}>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">{helpdeskMetrics.vencidos}</span>
                  <span className="text-xs text-red-500">vencidos</span>
                </div>
              )}
            </div>
          )}

          {/* Inbox Button - Admin only, Desktop */}
          {currentUser?.role === 'admin' && (
            <Button 
              variant="ghost" 
              size="icon"
              className="relative min-h-[44px] min-w-[44px] hidden md:flex"
              onClick={handleInboxClick}
              aria-label="Inbox unificada"
            >
              <Inbox className="w-5 h-5" />
              {pendentesCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendentesCount}
                </span>
              )}
            </Button>
          )}

          {/* Client Mobile Menu - Mobile only */}
          {currentUser?.role !== 'admin' && (
            <ClienteMenuMobile 
              user={currentUser}
              stats={{ 
                processos: pendentesCount, 
                tickets: pendentesCount,
                consultas: pendentesCount 
              }}
            />
          )}

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-1 rounded-full min-h-[44px] min-w-[44px]" aria-label="Menu do usuário">
                  <CustomAvatar
                    src={currentUser.foto_url || currentUser.avatar_url || currentUser.profile_photo || currentUser.avatar}
                    alt={currentUser.full_name}
                    fallback={currentUser.full_name?.charAt(0) || 'U'}
                    className="h-10 w-10"
                    fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] font-semibold"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-[var(--bg-elevated)] shadow-xl border border-[var(--border-primary)]" align="end" forceMount>
                <DropdownMenuLabel className="font-semibold text-[var(--brand-text-primary)]">
                  <div className="flex flex-col gap-1">
                    <span>{currentUser.full_name}</span>
                    <span className="text-xs font-normal text-[var(--text-secondary)]">{currentUser.email}</span>
                    {currentUser.role === 'admin' && (
                      <span className="text-xs bg-[var(--brand-warning)] text-white px-2 py-0.5 rounded-full font-bold inline-block w-fit">ADMIN</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Dashboard")} className="cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("MeuPainel")} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Meu Painel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Profile")} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Settings")} className="cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div className="cursor-pointer">
                    <ThemeSwitcher />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Search - Admin only */}
      {currentUser?.role === 'admin' && (
        <div className="md:hidden px-4 pb-3">
          <GlobalSearchValidated 
            escritorioId={currentUser?.escritorio_id}
            onResultClick={(result) => {
              if (result.url) {
                navigate(result.url);
              }
            }}
          />
        </div>
      )}
    </header>
  );
}