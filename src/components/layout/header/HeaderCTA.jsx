import React from 'react';
import { Phone, LogIn, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { base44 } from '@/api/base44Client';

export default function HeaderCTA({ currentUser, onLogin, mobile = false, mostrarBotaoLogin = true }) {
  const containerClass = mobile ? "space-y-3 pt-4 border-t border-[var(--border-primary)]" : "flex items-center gap-3";

  const handleLogout = async () => {
    try {
      await base44.auth.logout(createPageUrl("Home"));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={containerClass}>
      <a 
        href="https://wa.me/5551996032004" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${mobile ? 'w-full' : ''} inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--brand-success)] hover:bg-[#0d9c6e] text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-sm`}
        aria-label="Falar com advogado via WhatsApp"
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
        {mobile ? 'Falar no WhatsApp' : 'WhatsApp'}
      </a>

      {mostrarBotaoLogin && (
        <>
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer" aria-label="Menu do usuário">
                  <CustomAvatar 
                    src={currentUser.avatar} 
                    alt={currentUser.full_name} 
                    fallback={currentUser.full_name?.charAt(0) || 'U'} 
                    className="w-8 h-8 ring-2 ring-[var(--brand-primary)]"
                  />
                  <span className={`${mobile ? '' : 'hidden xl:block'} text-sm font-medium text-[var(--text-primary)]`}>
                    {currentUser.full_name?.split(' ')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span>{currentUser.full_name}</span>
                    <span className="text-xs font-normal text-[var(--text-secondary)]">{currentUser.email}</span>
                    {currentUser.role === 'admin' && (
                      <span className="text-xs bg-[var(--brand-warning)] text-white px-2 py-0.5 rounded-full font-bold inline-block w-fit">ADMIN</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser.role === 'admin' ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Dashboard")}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("MeuPainel")}>
                        <User className="mr-2 h-4 w-4" />
                        Meu Painel
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("MeuPainel")}>
                      <User className="mr-2 h-4 w-4" />
                      Meu Painel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button onClick={onLogin} className={`${mobile ? 'w-full' : ''} inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white rounded-lg font-semibold transition-all text-sm`} aria-label="Entrar na plataforma">
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Entrar
            </button>
          )}
        </>
      )}
    </div>
  );
}