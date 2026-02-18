import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import PlanosSidebar from '@/components/planos/PlanosSidebar';
import PlanoContent from '@/components/planos/PlanoContent';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function PlanosPagamento() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modoEditor, setModoEditor] = useState(null);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
  };

  const { data: planos = [], refetch } = useQuery({
    queryKey: ['planos-pagamento', user?.email],
    queryFn: async () => {
      if (!user) return [];
      if (user.role === 'admin') {
        return base44.entities.PlanoPagamento.list('-created_date');
      }
      return base44.entities.PlanoPagamento.filter({ cliente_id: user.id }, '-created_date');
    },
    enabled: !!user
  });

  const handleNovo = () => {
    setModoEditor('novo');
    setPlanoSelecionado(null);
  };

  const handleSalvar = () => {
    setModoEditor(null);
    refetch();
  };

  const handleCancelar = () => {
    setModoEditor(null);
  };

  if (!user) return <ResumeLoader />;

  if (user.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Acesso restrito a administradores</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-[var(--border-primary)] bg-[var(--bg-elevated)]">
        <Breadcrumb items={[
          { label: 'Superendividamento', url: createPageUrl('Dividas') },
          { label: user?.role === 'admin' ? 'Planos de Pagamento' : 'Meu Plano' }
        ]} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Planos de Pagamento</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{planos.length} planos</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {user?.role === 'admin' && (
          <PlanosSidebar
            planos={planos}
            selected={planoSelecionado}
            onSelect={setPlanoSelecionado}
            onNovo={handleNovo}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
        
        <PlanoContent
          modo={modoEditor}
          planoSelecionado={planoSelecionado}
          onSalvar={handleSalvar}
          onCancelar={handleCancelar}
        />
      </div>
    </div>
  );
}