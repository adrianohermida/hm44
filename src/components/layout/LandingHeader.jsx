import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import HeaderBrand from './header/HeaderBrand';
import HeaderNav from './header/HeaderNav';
import HeaderCTA from './header/HeaderCTA';
import HeaderMobile from './header/HeaderMobile';

export default function LandingHeader({ currentUser, onLogin, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { data: configs = [] } = useQuery({
    queryKey: ['configs-header'],
    queryFn: async () => {
      const allConfigs = await base44.entities.ConfiguracaoPublicidade.list();
      return allConfigs || [];
    },
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: true
  });

  const paginaAtual = location.pathname.split('/')[1] || 'Home';
  const configAtual = configs.find(c => c.page_name === paginaAtual);
  
  // Admin SEMPRE vê o botão
  const isAdmin = currentUser?.role === 'admin';
  const esconderLogin = configAtual?.esconder_botao_login === true;
  const mostrarBotao = isAdmin || !esconderLogin || currentUser;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Início', to: createPageUrl('Home') },
    { label: 'Sobre', to: createPageUrl('About') },
    { label: 'Serviços', to: createPageUrl('Home'), anchor: '#servicos-section' },
    { label: 'Calculadora', to: createPageUrl('Home'), anchor: '#calculadora-section' },
    { label: 'Blog', to: createPageUrl('Blog') },
    { label: 'Contato', to: createPageUrl('Contact') }
  ];

  return (
    <nav className="fixed top-0 w-full z-40 bg-[var(--header-bg)] border-b border-[var(--header-border)] shadow-sm transition-colors duration-200" role="navigation" aria-label="Navegação principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <HeaderBrand />
          <HeaderNav links={links} />
          
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <div className="hidden lg:block">
              <HeaderCTA 
                currentUser={currentUser} 
                onLogin={onLogin}
                mostrarBotaoLogin={mostrarBotao}
              />
            </div>
            <button 
              onClick={() => setMobileOpen(true)} 
              className="lg:hidden p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 text-[var(--text-primary)]" />
            </button>
          </div>
        </div>
      </div>

      <HeaderMobile 
        isOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        links={links}
        currentUser={currentUser}
        onLogin={onLogin}
        mostrarBotao={mostrarBotao}
      />
    </nav>
  );
}