import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function VersionHistory({ artigoId, onRollback }) {
  const queryClient = useQueryClient();

  const { data: versoes = [] } = useQuery({
    queryKey: ['blog-versions', artigoId],
    queryFn: () => base44.entities.BlogVersion.filter({ artigo_id: artigoId }, '-versao_numero')
  });

  const rollbackMutation = useMutation({
    mutationFn: async (versao) => {
      const artigo = (await base44.entities.Blog.filter({ id: artigoId }))[0];
      
      await base44.entities.Blog.update(artigoId, {
        titulo: versao.titulo,
        resumo: versao.resumo,
        conteudo: versao.conteudo
      });

      await base44.entities.BlogVersion.create({
        artigo_id: artigoId,
        versao_numero: (versoes[0]?.versao_numero || 0) + 1,
        titulo: artigo.titulo,
        resumo: artigo.resumo,
        conteudo: artigo.conteudo,
        alterado_por: artigo.created_by,
        mudancas_descricao: `Rollback para versão ${versao.versao_numero}`,
        escritorio_id: artigo.escritorio_id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-versions']);
      queryClient.invalidateQueries(['blog-admin']);
      toast.success("Versão restaurada");
      if (onRollback) onRollback();
    }
  });

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        Histórico de Versões
      </h3>
      
      {versoes.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma versão anterior</p>
      ) : (
        <div className="space-y-3">
          {versoes.map((versao) => (
            <div key={versao.id} className="flex items-start justify-between border-b pb-3">
              <div>
                <p className="font-medium text-sm">Versão {versao.versao_numero}</p>
                <p className="text-xs text-gray-500">
                  {new Date(versao.created_date).toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-600 mt-1">{versao.mudancas_descricao}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => rollbackMutation.mutate(versao)}
                disabled={rollbackMutation.isPending}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Restaurar
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}