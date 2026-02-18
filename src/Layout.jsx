import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./globals.css";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Scale, Home, Sparkles, Users, CreditCard, Mail, Info, Briefcase, TrendingUp, LogOut, Settings as SettingsIcon, FileText, Calendar, MessageSquare, Shield, Plug, BarChart3, DollarSign, Target, User as UserIcon } from "lucide-react";
import { useConversasPendentes } from "@/components/hooks/useConversasPendentes";
import { useDesktopNotifications } from "@/components/hooks/useDesktopNotifications";
import { useRealtimeNotifications } from "@/components/hooks/useRealtimeNotifications";
import { useTicketNotifications } from "@/components/helpdesk/notifications/useTicketNotifications";
import { Button } from "@/components/ui/button";
import ResumeLoader from "@/components/common/ResumeLoader";
import Footer from "@/components/layout/Footer";
import LandingHeader from "@/components/layout/LandingHeader";
import PublicChatWidget from "@/components/PublicChatWidget";
import ChatWidget from "@/components/ChatWidget";
import ClienteBottomNav from "@/components/cliente/ClienteBottomNav";
import ClienteSidebar from "@/components/cliente/ClienteSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import useRateLimitHandler from "@/components/hooks/useRateLimitHandler";
import TopHeader from "@/components/layout/TopHeader";
import CollapsibleSidebar from "@/components/layout/CollapsibleSidebar";
import ErrorLogger from "@/components/debug/ErrorLogger";

import PageAnalytics from "@/components/analytics/PageAnalytics";
import SkipLink from "@/components/seo/SkipLink";
import TrackingScripts from "@/components/seo/TrackingScripts";
import GTMBody from "@/components/seo/GTMBody";

const userNavigationItems = [
  { title: "Início", url: createPageUrl("Home"), icon: Home },
  { title: "Meu Painel", url: createPageUrl("Dashboard"), icon: FileText },
  { title: "Minhas Consultas", url: createPageUrl("MinhasConsultas"), icon: Calendar },
  { title: "Meus Tickets", url: createPageUrl("MeusTickets"), icon: MessageSquare },
  { title: "Meus Modelos", url: createPageUrl("TemplatesEmail"), icon: Sparkles },
  { title: "Onde Conciliar", url: createPageUrl("OndeConciliar"), icon: Briefcase },
  { title: "Planos de Pagamento", url: createPageUrl("PlanosPagamento"), icon: Target },
  { title: "Meus Processos", url: createPageUrl("Processos"), icon: FileText },
  { title: "Monitoramento", url: createPageUrl("Analytics"), icon: TrendingUp },
  { title: "Faturas", url: createPageUrl("Faturas"), icon: FileText },
];

const adminNavigationItems = [
  { title: "Início", url: createPageUrl("Home"), icon: Home },
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: BarChart3 },
  { title: "Meu Painel", url: createPageUrl("MeuPainel"), icon: UserIcon },
  { title: "Pessoas", url: createPageUrl("Pessoas"), icon: Users },
  { title: "Processos", url: createPageUrl("Processos"), icon: FileText },
  { title: "Atendimento", url: createPageUrl("Helpdesk"), icon: MessageSquare },
  { title: "Financeiro", url: createPageUrl("Financeiro"), icon: DollarSign },
  { title: "Marketing", url: createPageUrl("Marketing"), icon: Sparkles },
  { title: "Superendividamento", url: createPageUrl("Dividas"), icon: CreditCard },
  { title: "Plataforma", url: createPageUrl("Plataforma"), icon: Shield },
  { title: "Conectores", url: createPageUrl("Conectores"), icon: Plug },
  { title: "Relatórios", url: createPageUrl("Relatorios"), icon: TrendingUp },
];

const publicItems = [
  { title: "Sobre o Escritório", url: createPageUrl("About"), icon: Info },
  { title: "Blog", url: createPageUrl("Blog"), icon: FileText },
  { title: "Fale Conosco", url: createPageUrl("Contact"), icon: Mail }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isLanding = currentPageName === "Home";
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [escritorio, setEscritorio] = useState(null);
  const [loadingEscritorio, setLoadingEscritorio] = useState(false);
  const conversasPendentes = useConversasPendentes();
  const isPublicPage = isLanding || currentPageName === "About" || currentPageName === "Contact" || currentPageName === "Blog" || currentPageName === "BlogPost" || currentPageName === "NotFound" || currentPageName === "EditorPlano" || currentPageName === "OndeConciliar";
  const clientPages = ["MeuPainel","MeusProcessos","MeusTickets","MinhasConsultas","MinhasFaturas","MeusDocumentos","MeuPlanoPagamento","MinhaAgenda","AgendarConsulta","MinhasConsultas"];
  const isClientPage = clientPages.includes(currentPageName);
  
  useDesktopNotifications((!isPublicPage || isClientPage) && !!currentUser);
  useRealtimeNotifications((!isPublicPage || isClientPage) && !!currentUser);
  useTicketNotifications(currentUser?.role === 'admin' && !!currentUser && !!escritorio, escritorio?.id);
  useRateLimitHandler();

  useEffect(() => {
    checkAuthStatus();
  }, [currentPageName]);

  useEffect(() => {
    const loadEscritorio = async () => {
      if (!currentUser) return;
      setLoadingEscritorio(true);
      try {
        const result = await base44.entities.Escritorio.list();
        setEscritorio(result?.[0] || null);
      } catch (error) {
        console.error('Erro ao carregar escritório:', error);
        setEscritorio(null);
      } finally {
        setLoadingEscritorio(false);
      }
    };
    loadEscritorio();
  }, [currentUser]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => observer.disconnect();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await base44.auth.me();
      
      if (user && currentPageName === 'Home') {
        if (user.role === 'admin') {
          window.location.href = createPageUrl('Dashboard');
        } else {
          window.location.href = createPageUrl('MeuPainel');
        }
        return;
      }
      
      setCurrentUser(user || null);
      setIsGuestMode(!user);
    } catch (_e) {
      setCurrentUser(null);
      setIsGuestMode(true);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await base44.auth.logout(createPageUrl("Home"));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const nextUrl = window.location.pathname === '/' || window.location.pathname === createPageUrl("Home")
        ? createPageUrl("Dashboard")
        : window.location.pathname;
      
      await base44.auth.redirectToLogin(nextUrl);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (isLoading || loadingEscritorio) return <ResumeLoader />;

  const isComunicacaoPage = currentPageName === "Comunicacao";

  if (isPublicPage && !isClientPage) {
    return (
      <div>
        <TrackingScripts />
        <GTMBody />
        <SkipLink />
        <PageAnalytics />
        <LandingHeader 
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <main id="main-content" className="pt-16">{children}</main>
        <Footer />
        <PublicChatWidget />
      </div>
    );
  }

  // Client Pages (MeuPainel, MeusProcessos, MeusTickets, etc) - Com Header Público
  // NOTA: MeuPainel tem sidebar próprio integrado, não renderizar duplicado aqui
  if (isClientPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-secondary)]">
        <TrackingScripts />
        <GTMBody />
        <SkipLink />
        <PageAnalytics />

        <LandingHeader 
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        <main id="main-content" className="flex-1 overflow-auto bg-[var(--bg-secondary)] pb-24 lg:pb-0 pt-16">
          <div className="min-h-full">
            {children}
          </div>
        </main>

        <Footer />
        {!isComunicacaoPage && <ChatWidget />}
        <ClienteBottomNav 
          user={currentUser}
          stats={{
            processos: conversasPendentes?.length || 0,
            tickets: conversasPendentes?.length || 0
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-secondary)]">
      <TrackingScripts />
      <GTMBody />
      <TopHeader 
        currentUser={currentUser} 
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        conversasPendentes={conversasPendentes}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block">
          <CollapsibleSidebar 
            isAdmin={currentUser?.role === 'admin'}
            conversasPendentes={conversasPendentes}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        <main className="flex-1 overflow-auto bg-[var(--bg-secondary)] pb-20 lg:pb-0">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {!isComunicacaoPage && <ChatWidget />}
      <MobileBottomNav 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      {currentUser?.role === 'admin' && <ErrorLogger userRole={currentUser.role} />}
    </div>
      );
      }