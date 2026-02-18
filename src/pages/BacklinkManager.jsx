import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Search, ExternalLink, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import PortalCard from "@/components/backlinks/PortalCard";
import PortalFormModal from "@/components/backlinks/PortalFormModal";
import BuscaNoticiasPanel from "@/components/backlinks/BuscaNoticiasPanel";
import BacklinkStats from "@/components/backlinks/BacklinkStats";

export default function BacklinkManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingPortal, setEditingPortal] = useState(null);
  const [showBusca, setShowBusca] = useState(false);
  const queryClient = useQueryClient();

  const { data: portais = [], isLoading } = useQuery({
    queryKey: ['portais-midia'],
    queryFn: () => base44.entities.PortalMidia.list('-ordem_exibicao')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PortalMidia.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['portais-midia']);
      setShowForm(false);
      toast.success('Portal adicionado com sucesso');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PortalMidia.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['portais-midia']);
      setEditingPortal(null);
      toast.success('Portal atualizado');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PortalMidia.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['portais-midia']);
      toast.success('Portal removido');
    }
  });

  const handleEdit = (portal) => {
    setEditingPortal(portal);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    if (editingPortal) {
      updateMutation.mutate({ id: editingPortal.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const portaisAtivos = portais.filter(p => p.ativo);
  const portaisHome = portais.filter(p => p.exibir_home && p.ativo);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Backlink & Link Building
            </h1>
            <p className="text-[var(--text-secondary)] mt-2">
              Gerencie portais e monitore backlinks
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowBusca(true)}
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar Notícias
            </Button>
            <Button onClick={() => {
              setEditingPortal(null);
              setShowForm(true);
            }} className="gap-2 bg-[var(--brand-primary)]">
              <Plus className="w-4 h-4" />
              Adicionar Portal
            </Button>
          </div>
        </div>

        <BacklinkStats portais={portais} />

        <div className="grid gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <BarChart3 className="w-4 h-4" />
            <span>{portaisAtivos.length} portais ativos</span>
            <span>•</span>
            <span>{portaisHome.length} exibidos no Home</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : portais.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[var(--border-primary)]">
            <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Nenhum portal cadastrado
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Adicione portais onde suas matérias são publicadas
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Primeiro Portal
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portais.map(portal => (
              <PortalCard
                key={portal.id}
                portal={portal}
                onEdit={handleEdit}
                onDelete={(id) => deleteMutation.mutate(id)}
                onToggleActive={(id, ativo) => 
                  updateMutation.mutate({ id, data: { ativo } })
                }
              />
            ))}
          </div>
        )}

        {showForm && (
          <PortalFormModal
            portal={editingPortal}
            onClose={() => {
              setShowForm(false);
              setEditingPortal(null);
            }}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}

        {showBusca && (
          <BuscaNoticiasPanel
            onClose={() => setShowBusca(false)}
            portais={portais}
          />
        )}
      </div>
    </div>
  );
}