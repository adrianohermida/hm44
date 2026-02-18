import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import GruposList from '@/components/clientes/grupos/GruposList';
import LoadingState from '@/components/common/LoadingState';

export default function GruposEconomicos() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      if (user?.role === 'admin' && user?.email === 'adrianohermida@gmail.com') {
        const result = await base44.entities.Escritorio.list();
        return result[0];
      }
      const result = await base44.entities.Escritorio.filter({ created_by: user.email });
      return result[0];
    },
    enabled: !!user
  });

  const { data: grupos = [], isLoading } = useQuery({
    queryKey: ['grupos', escritorio?.id],
    queryFn: () => base44.entities.GrupoEconomico.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn: () => base44.entities.Cliente.filter({ tipo_pessoa: 'juridica' })
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Breadcrumb items={[{ label: 'Grupos Econômicos' }]} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Grupos Econômicos</h1>
          <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" />Novo Grupo</Button>
        </div>
        <GruposList grupos={grupos} empresas={empresas} onSelect={(id) => {}} />
      </div>
    </div>
  );
}