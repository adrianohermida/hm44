import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import GatilhoCard from '@/components/marketing/GatilhoCard';
import GatilhoFilter from '@/components/marketing/GatilhoFilter';
import GatilhoStats from '@/components/marketing/GatilhoStats';
import GatilhoFormModal from '@/components/marketing/GatilhoFormModal';
import { toast } from 'sonner';

export default function GatilhosMarketing() {
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingGatilho, setEditingGatilho] = useState(null);
  const queryClient = useQueryClient();
  
  const { data: gatilhos = [] } = useQuery({
    queryKey: ['gatilhos'],
    queryFn: () => base44.entities.GatilhoMarketing.list('-created_date'),
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  // Criar gatilho hero default se não existir
  React.useEffect(() => {
    if (gatilhos.length === 0 && user) {
      const heroDefault = {
        tipo_conteudo: 'hero',
        headline_primaria: 'Elimine Até 70% das Suas Dívidas Legalmente',
        headline_secundaria: 'Advocacia especializada em superendividamento. Mais de R$ 35 milhões renegociados com 98% de sucesso.',
        cta_primario_texto: 'Calcular Gratuitamente',
        cta_secundario_texto: 'Falar com Especialista',
        cta_secundario_link: 'https://wa.me/5511999999999',
        badge_texto: 'Lei 14.181/2021 • Vigente desde 2021',
        estatistica_1_valor: '98%',
        estatistica_1_label: 'Taxa de Sucesso',
        estatistica_1_visivel: true,
        estatistica_2_valor: 'R$ 35M+',
        estatistica_2_label: 'Renegociados',
        estatistica_2_visivel: true,
        estatistica_3_valor: '5.000+',
        estatistica_3_label: 'Clientes',
        estatistica_3_visivel: true,
        estatistica_4_valor: '12 Anos',
        estatistica_4_label: 'Experiência',
        estatistica_4_visivel: true,
        status: 'ativo'
      };
      base44.entities.GatilhoMarketing.create(heroDefault).then(() => {
        queryClient.invalidateQueries(['gatilhos']);
      });
    }
  }, [gatilhos, user, queryClient]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.GatilhoMarketing.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gatilhos'] });
      toast.success('Gatilho criado com sucesso');
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GatilhoMarketing.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gatilhos'] });
      toast.success('Gatilho atualizado com sucesso');
      setShowForm(false);
      setEditingGatilho(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.GatilhoMarketing.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gatilhos'] });
      toast.success('Gatilho removido');
    },
  });

  const filtered = gatilhos.filter(g => filter === 'all' || g.tipo_conteudo === filter || g.status === filter);
  const sorted = [...filtered].sort((a, b) => (b.metricas_ab?.taxa_conversao || 0) - (a.metricas_ab?.taxa_conversao || 0));
  const ativos = gatilhos.filter(g => g.status === 'ativo').length;
  const rascunhos = gatilhos.filter(g => g.status === 'rascunho').length;

  const handleEdit = (gatilho) => {
    setEditingGatilho(gatilho);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    if (editingGatilho) {
      updateMutation.mutate({ id: editingGatilho.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Gatilhos Marketing</h1>
            <p className="text-[var(--text-secondary)] mt-1">Gerencie conteúdo do Hero e CTAs</p>
          </div>
          <Button 
            onClick={() => {
              setEditingGatilho(null);
              setShowForm(true);
            }}
            className="bg-[var(--brand-primary)]"
          >
            <Plus className="w-4 h-4 mr-2" />Novo Gatilho
          </Button>
        </div>

        <GatilhoStats pendentes={rascunhos} aprovados={ativos} conversaoMedia={2.4} />
        <GatilhoFilter value={filter} onChange={setFilter} />

        <div className="grid gap-4 mt-6">
          {sorted.map(g => (
            <GatilhoCard
              key={g.id}
              gatilho={g}
              onEdit={() => handleEdit(g)}
              onDelete={() => deleteMutation.mutate(g.id)}
              onToggleStatus={() => updateMutation.mutate({ 
                id: g.id, 
                data: { status: g.status === 'ativo' ? 'inativo' : 'ativo' }
              })}
            />
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)] mb-4">Nenhum gatilho encontrado</p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />Criar Primeiro Gatilho
            </Button>
          </div>
        )}
      </div>

      <GatilhoFormModal
        gatilho={editingGatilho}
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingGatilho(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}