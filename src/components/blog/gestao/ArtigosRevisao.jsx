import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import RevisaoHeader from "./revisao/RevisaoHeader";
import RevisaoFilters from "./revisao/RevisaoFilters";
import RevisaoList from "./revisao/RevisaoList";
import RevisaoModal from "./revisao/RevisaoModal";

export default function ArtigosRevisao() {
  const [filtroStatus, setFiltroStatus] = useState("revisao");
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
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

  const { data: artigos, isLoading } = useQuery({
    queryKey: ['artigos-revisao', filtroStatus, escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return base44.entities.Blog.filter({
        escritorio_id: escritorio.id,
        status: filtroStatus
      });
    },
    enabled: !!escritorio?.id
  });

  const revisarMutation = useMutation({
    mutationFn: async ({ artigoId, acao, feedback }) => {
      const novoStatus = acao === 'aprovar' ? 'publicado' : 
                        acao === 'rejeitar' ? 'rascunho' : 'revisao';
      
      await base44.entities.Blog.update(artigoId, {
        status: novoStatus,
        revisado_por: user.email,
        data_revisao: new Date().toISOString(),
        feedback_revisao: feedback
      });

      await base44.entities.Notificacao.create({
        tipo: 'revisao_artigo',
        titulo: `Artigo ${acao === 'aprovar' ? 'aprovado' : 'com feedback'}`,
        mensagem: feedback || `Seu artigo foi ${acao === 'aprovar' ? 'aprovado' : 'enviado para revisão'}`,
        user_email: artigos.find(a => a.id === artigoId)?.created_by,
        link: `/EditorBlog?id=${artigoId}`,
        escritorio_id: escritorio.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['artigos-revisao']);
      queryClient.invalidateQueries(['blog-admin']);
      setArtigoSelecionado(null);
      toast.success('Revisão registrada');
    }
  });

  const handleRevisao = (acao, feedback) => {
    if (!artigoSelecionado) return;
    revisarMutation.mutate({
      artigoId: artigoSelecionado.id,
      acao,
      feedback
    });
  };

  if (user?.role !== 'admin') return null;

  return (
    <Card className="p-4 sm:p-6">
      <RevisaoHeader total={artigos?.length || 0} />
      <RevisaoFilters 
        status={filtroStatus}
        onChange={setFiltroStatus}
      />
      <RevisaoList
        artigos={artigos || []}
        isLoading={isLoading}
        onRevisar={setArtigoSelecionado}
      />
      
      {artigoSelecionado && (
        <RevisaoModal
          artigo={artigoSelecionado}
          onClose={() => setArtigoSelecionado(null)}
          onRevisar={handleRevisao}
          isLoading={revisarMutation.isPending}
        />
      )}
    </Card>
  );
}