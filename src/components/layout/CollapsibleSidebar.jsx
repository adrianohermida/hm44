import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Home, FileText, Calendar, MessageSquare, Users, CreditCard, Mail, Info, 
  Briefcase, TrendingUp, BarChart3, DollarSign, Target, Shield, Plug, 
  Sparkles, Inbox, UserCircle2, LayoutDashboard, GripVertical, ChevronDown, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import OnlineUsersModal from './OnlineUsersModal';

const userNavigationItems = [
  { title: "Início", url: createPageUrl("Home"), icon: Home },
  { title: "Meu Painel", url: createPageUrl("Dashboard"), icon: FileText },
  { title: "Minhas Consultas", url: createPageUrl("MinhasConsultas"), icon: Calendar },
  { title: "Meus Tickets", url: createPageUrl("MeusTickets"), icon: MessageSquare },
  { title: "Meus Modelos", url: createPageUrl("TemplatesEmail"), icon: Sparkles },
  { title: "Onde Conciliar", url: createPageUrl("OndeConciliar"), icon: Briefcase },
  { title: "Meu Plano", url: createPageUrl("PlanosPagamento"), icon: Target },
  { title: "Meus Processos", url: createPageUrl("Processos"), icon: FileText },
  { title: "Monitoramento", url: createPageUrl("Analytics"), icon: TrendingUp },
  { 
    title: "Prazos", 
    icon: Calendar,
    submenu: [
      { title: "Kanban", url: createPageUrl("Prazos"), icon: LayoutDashboard },
      { title: "Calendário", url: createPageUrl("CalendarioPrazos"), icon: Calendar },
      { title: "Analytics", url: createPageUrl("PrazosAnalytics"), icon: BarChart3 }
    ]
  },
  { title: "Faturas", url: createPageUrl("Faturas"), icon: FileText },
];

const defaultAdminItems = [
  { id: 'visao-geral', title: "Visão Geral", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { id: 'helpdesk', title: "Atendimento", url: createPageUrl("Helpdesk"), icon: Inbox },
  { id: 'pessoas', title: "Pessoas", url: createPageUrl("Clientes"), icon: Users },
  { id: 'processos', title: "Processos", url: createPageUrl("Processos"), icon: FileText },
  { id: 'financeiro', title: "Financeiro", url: createPageUrl("Financeiro"), icon: DollarSign },
  { id: 'relatorios', title: "Relatórios", url: createPageUrl("Relatorios"), icon: TrendingUp },
  { id: 'marketing', title: "Marketing", url: createPageUrl("Marketing"), icon: Sparkles },
  { id: 'administracao', title: "Administração", url: createPageUrl("Administracao"), icon: Shield },
];

const publicItems = [
  { id: 'inicio', title: "Início", url: createPageUrl("Home"), icon: Home },
  { id: 'sobre', title: "Sobre", url: createPageUrl("About"), icon: Info },
  { id: 'blog', title: "Blog", url: createPageUrl("Blog"), icon: FileText },
  { id: 'contato', title: "Fale Conosco", url: createPageUrl("Contact"), icon: Mail }
];

export default function CollapsibleSidebar({ isAdmin, conversasPendentes, isCollapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminItems, setAdminItems] = useState(defaultAdminItems);
  const [institucionalCollapsed, setInstitucionalCollapsed] = useState(true);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const navigationItems = isAdmin ? adminItems : userNavigationItems;

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(adminItems);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    
    setAdminItems(items);
  };

  const NavItem = ({ item, isDragging, dragHandleProps }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.title];
    const isActive = item.url && location.pathname === item.url;
    const Icon = item.icon;
    
    if (hasSubmenu && !isCollapsed) {
      return (
        <div>
          <div
            onClick={() => setExpandedMenus(prev => ({ ...prev, [item.title]: !prev[item.title] }))}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--brand-primary-50)] cursor-pointer group min-h-[44px]"
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium flex-1">{item.title}</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          {isExpanded && (
            <div className="ml-8 space-y-1 mt-1">
              {item.submenu.map(subItem => (
                <div
                  key={subItem.url}
                  onClick={() => navigate(subItem.url)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm",
                    location.pathname === subItem.url
                      ? "bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]"
                      : "hover:bg-[var(--brand-primary-50)]"
                  )}
                >
                  <subItem.icon className="w-4 h-4" />
                  <span>{subItem.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    const button = (
      <div
        onClick={() => item.url && navigate(item.url)}
        data-testid={`nav-item-${item.title?.toLowerCase().replace(/\s/g, '-')}`}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-h-[44px] cursor-pointer group",
          isActive 
            ? "bg-[var(--brand-primary-50)] text-[var(--brand-primary-700)]" 
            : "hover:bg-[var(--brand-primary-50)] hover:text-[var(--text-primary)]",
          isCollapsed && "justify-center px-2",
          isDragging && "shadow-lg opacity-80"
        )}
      >
        {isAdmin && !isCollapsed && dragHandleProps && (
          <div {...dragHandleProps} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-[var(--text-tertiary)]" />
          </div>
        )}
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span className="font-medium flex-1">{item.title}</span>}
        {!isCollapsed && item.title === 'Helpdesk' && conversasPendentes > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
            {conversasPendentes}
          </span>
        )}
      </div>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <aside 
      className={cn(
        "border-r border-[var(--border-primary)] bg-[var(--bg-elevated)] backdrop-blur-xl shadow-xl transition-all duration-300 h-full",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {isAdmin ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="admin-nav">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="space-y-1 mb-6"
                  >
                    {adminItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <NavItem 
                              item={item} 
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="space-y-1 mb-6">
              {userNavigationItems.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </div>
          )}

          {!isCollapsed && (
            <div className="pt-6 border-t border-[var(--border-primary)]">
              <button
                onClick={() => setInstitucionalCollapsed(!institucionalCollapsed)}
                className="flex items-center justify-between w-full px-2 mb-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider hover:text-[var(--brand-primary)] transition-colors min-h-[32px]"
              >
                Institucional
                {institucionalCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {!institucionalCollapsed && (
                <div className="space-y-1">
                  {publicItems.map((item) => (
                    <NavItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Online Users Indicator */}
        <div className="border-t border-[var(--border-primary)] p-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setShowOnlineUsers(true)}
                  className={cn(
                    "w-full flex items-center gap-3 min-h-[44px] hover:bg-[var(--brand-primary-50)]",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <div className="relative">
                    <UserCircle2 className="w-8 h-8 text-[var(--brand-primary)]" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold">Usuários Online</p>
                      <p className="text-xs text-[var(--text-secondary)]">Ver disponíveis</p>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>Ver Usuários Online</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <OnlineUsersModal open={showOnlineUsers} onOpenChange={setShowOnlineUsers} />
    </aside>
  );
}