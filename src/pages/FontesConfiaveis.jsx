import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Plus, Shield, ExternalLink, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FonteFormModal from "@/components/marketing/FonteFormModal";
import Breadcrumb from "@/components/seo/Breadcrumb";

export default function FontesConfiaveis() {
  const [modalOpen, setModalOpen] = useState(false);
  const [fonteEditando, setFonteEditando] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: fontes = [], isLoading } = useQuery({
    queryKey: ['fontes-confiaveis', escritorio?.id],
    queryFn: () => base44.entities.FonteConfiavel.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FonteConfiavel.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fontes-confiaveis']);
      toast.success('Fonte removida');
    }
  });

  const fontesOficiais = fontes.filter(f => ['tribunal', 'orgao_oficial'].includes(f.tipo));
  const fontesJurisprudencia = fontes.filter(f => f.tipo === 'jurisprudencia');
  const fontesNoticias = fontes.filter(f => f.tipo === 'noticia_juridica');

  if (user?.role !== 'admin') return <div className="p-8 text-center text-red-600">Acesso restrito</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Breadcrumb items={[
        { label: 'Marketing', url: '/Marketing' },
        { label: 'Fontes Confiáveis' }
      ]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-green-600" />
            Fontes Confiáveis
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie fontes oficiais para validação de conteúdo jurídico
          </p>
        </div>
        <Button onClick={() => { setFonteEditando(null); setModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Fonte
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="space-y-6">
          <FonteSection
            title="Tribunais Oficiais"
            icon={Shield}
            fontes={fontesOficiais}
            onEdit={(f) => { setFonteEditando(f); setModalOpen(true); }}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
          <FonteSection
            title="Bases de Jurisprudência"
            icon={Shield}
            fontes={fontesJurisprudencia}
            onEdit={(f) => { setFonteEditando(f); setModalOpen(true); }}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
          <FonteSection
            title="Portais de Notícias Jurídicas"
            icon={Shield}
            fontes={fontesNoticias}
            onEdit={(f) => { setFonteEditando(f); setModalOpen(true); }}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        </div>
      )}

      <FonteFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setFonteEditando(null); }}
        fonte={fonteEditando}
        escritorioId={escritorio?.id}
      />
    </div>
  );
}

function FonteSection({ title, icon: Icon, fontes, onEdit, onDelete }) {
  if (fontes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-green-600" />
          {title} ({fontes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {fontes.map(fonte => (
            <div key={fonte.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{fonte.nome}</h3>
                  {fonte.confiabilidade === 'alta' && (
                    <Badge variant="default" className="bg-green-600">Alta Confiabilidade</Badge>
                  )}
                  {fonte.usar_em_ia && (
                    <Badge variant="outline">Usar em IA</Badge>
                  )}
                </div>
                <a href={fonte.url_base} target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  {fonte.url_base}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => onEdit(fonte)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(fonte.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}