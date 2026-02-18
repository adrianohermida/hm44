import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function ModerarComentarios() {
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

  const { data: comentarios = [], isLoading } = useQuery({
    queryKey: ['comentarios-moderacao'],
    queryFn: () => base44.entities.BlogComment.filter({ 
      escritorio_id: escritorio.id,
      aprovado: false 
    }, '-created_date'),
    enabled: !!escritorio && user?.role === 'admin'
  });

  const aprovarMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogComment.update(id, { aprovado: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['comentarios-moderacao']);
      toast.success("Comentário aprovado");
    }
  });

  const rejeitarMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogComment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comentarios-moderacao']);
      toast.success("Comentário rejeitado");
    }
  });

  if (user?.role !== 'admin') return <div className="p-8 text-center text-red-600">Acesso restrito</div>;
  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Moderar Comentários</h1>
      
      {comentarios.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          Nenhum comentário pendente de moderação
        </Card>
      ) : (
        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <Card key={comentario.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold">{comentario.autor_nome}</p>
                  <p className="text-sm text-gray-500">{comentario.autor_email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(comentario.created_date).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => aprovarMutation.mutate(comentario.id)}
                    className="text-green-600 border-green-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejeitarMutation.mutate(comentario.id)}
                    className="text-red-600 border-red-600"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              </div>
              <p className="text-gray-700">{comentario.conteudo}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}