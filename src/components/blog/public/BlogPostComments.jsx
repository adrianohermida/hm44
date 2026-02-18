import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

export default function BlogPostComments({ artigoId, escritorioId }) {
  const [formData, setFormData] = useState({ nome: "", email: "", conteudo: "" });
  const queryClient = useQueryClient();

  const { data: comentarios = [] } = useQuery({
    queryKey: ['comentarios', artigoId],
    queryFn: async () => {
      if (!artigoId) return [];
      try {
        return await base44.entities.BlogComment.filter({ 
          artigo_id: artigoId, 
          aprovado: true 
        }, '-created_date');
      } catch {
        return [];
      }
    },
    enabled: !!artigoId
  });

  if (!artigoId || !escritorioId) return null;

  const criarMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogComment.create({
      ...data,
      artigo_id: artigoId,
      escritorio_id: escritorioId,
      aprovado: false
    }),
    onSuccess: () => {
      toast.success("Comentário enviado para moderação");
      setFormData({ nome: "", email: "", conteudo: "" });
    }
  });

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
        <MessageSquare className="w-6 h-6" />
        Comentários ({comentarios.length})
      </h3>

      <Card className="p-6 bg-[var(--bg-secondary)] border-[var(--border-primary)]">
        <h4 className="font-bold mb-4 text-[var(--brand-primary)]">Deixe seu comentário</h4>
        <div className="space-y-3">
          <Input
            placeholder="Seu nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          <Input
            type="email"
            placeholder="Seu email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          <Textarea
            placeholder="Escreva seu comentário..."
            value={formData.conteudo}
            onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
            rows={4}
            className="bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          <Button 
            onClick={() => criarMutation.mutate(formData)}
            disabled={!formData.nome || !formData.email || !formData.conteudo}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Comentário
          </Button>
        </div>
      </Card>

      {comentarios.length > 0 && (
        <div className="space-y-6">
          {comentarios.map((comentario) => (
            <Card key={comentario.id} className="p-6 bg-[var(--bg-elevated)] border-[var(--border-primary)] shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-[var(--text-primary)]">{comentario.autor_nome || comentario.nome || 'Anônimo'}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {comentario.created_date ? new Date(comentario.created_date).toLocaleDateString('pt-BR') : ''}
                  </p>
                </div>
              </div>
              <p className="text-[var(--text-secondary)]">{comentario.conteudo}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}