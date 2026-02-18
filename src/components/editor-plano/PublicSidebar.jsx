import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, FileText, MapPin, CreditCard, Lock, Info, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function PublicSidebar() {
  const menuPrincipal = [
    { icon: Home, label: 'Início', path: 'Home', public: true },
    { icon: FileText, label: 'Meu Painel', path: 'Dashboard', public: false },
    { icon: FileText, label: 'Minhas Consultas', path: 'MinhasConsultas', public: false },
    { icon: FileText, label: 'Meus Tickets', path: 'MeusTickets', public: false },
    { icon: FileText, label: 'Meus Modelos', path: 'TemplatesEmail', public: false },
    { icon: MapPin, label: 'Onde Conciliar', path: 'OndeConciliar', public: true },
    { icon: CreditCard, label: 'Planos de Pagamento', path: 'EditorPlano', public: true, active: true },
    { icon: FileText, label: 'Meus Processos', path: 'Processos', public: false }
  ];

  const menuInstitucional = [
    { icon: Info, label: 'Sobre o Escritório', path: 'About' },
    { icon: Mail, label: 'Fale Conosco', path: 'Contact' }
  ];

  return (
    <div className="w-64 bg-[var(--bg-primary)] border-r border-[var(--border-primary)] flex flex-col h-screen overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[var(--text-primary)]">Dr. Adriano</h2>
            <p className="text-xs text-[var(--text-secondary)]">Planos de Pagamento</p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-[var(--brand-primary)] mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">
                  Modo Visitante
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Você está navegando como visitante. Cadastre-se para acessar todos os recursos!
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
              onClick={() => base44.auth.redirectToLogin()}
            >
              Criar Conta Grátis
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 pb-4 flex-1">
        <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
          Funcionalidades Principais
        </h3>
        <div className="space-y-1">
          {menuPrincipal.map((item) => (
            <Link
              key={item.path}
              to={createPageUrl(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-[var(--brand-primary-100)] text-[var(--brand-primary)]' 
                  : item.public
                    ? 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    : 'text-[var(--text-tertiary)] cursor-not-allowed opacity-60'
              }`}
              onClick={(e) => {
                if (!item.public) e.preventDefault();
              }}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm flex-1">{item.label}</span>
              {!item.public && <Lock className="w-3 h-3" />}
            </Link>
          ))}
        </div>

        <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 mt-6">
          Institucional
        </h3>
        <div className="space-y-1">
          {menuInstitucional.map((item) => (
            <Link
              key={item.path}
              to={createPageUrl(item.path)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border-primary)]">
        <Button 
          className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          onClick={() => base44.auth.redirectToLogin()}
        >
          Entrar
        </Button>
        <p className="text-xs text-center text-[var(--text-tertiary)] mt-2">
          Junte-se a milhares de usuários!
        </p>
      </div>
    </div>
  );
}