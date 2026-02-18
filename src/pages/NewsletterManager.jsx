import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Send, Users } from "lucide-react";
import { toast } from "sonner";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { createPageUrl } from "@/utils";

export default function NewsletterManager() {
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

  const { data: subscribers = [] } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: () => base44.entities.NewsletterSubscriber.filter({ 
      escritorio_id: escritorio.id 
    }),
    enabled: !!escritorio && user?.role === 'admin'
  });

  const { data: artigos = [] } = useQuery({
    queryKey: ['blog-newsletter'],
    queryFn: () => base44.entities.Blog.filter({ 
      escritorio_id: escritorio.id,
      publicado: true 
    }, '-data_publicacao', 10),
    enabled: !!escritorio && user?.role === 'admin'
  });

  const enviarMutation = useMutation({
    mutationFn: (artigoId) => base44.functions.invoke('enviarNewsletter', { artigo_id: artigoId }),
    onSuccess: (response) => {
      toast.success(`Newsletter enviada para ${response.data.enviados} assinantes`);
    }
  });

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Acesso restrito</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Breadcrumb items={[
        { label: 'Marketing', url: createPageUrl('Marketing') },
        { label: 'Newsletter' }
      ]} />
      <h1 className="text-3xl font-bold">Gerenciar Newsletter</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <Users className="w-8 h-8 mb-2 text-[var(--brand-primary)]" />
          <div className="text-2xl font-bold">{subscribers.length}</div>
          <div className="text-sm text-gray-600">Assinantes Ativos</div>
        </Card>

        <Card className="p-4">
          <Mail className="w-8 h-8 mb-2 text-blue-600" />
          <div className="text-2xl font-bold">
            {subscribers.filter(s => s.ativo).length}
          </div>
          <div className="text-sm text-gray-600">Ativos</div>
        </Card>

        <Card className="p-4">
          <Send className="w-8 h-8 mb-2 text-green-600" />
          <div className="text-2xl font-bold">{artigos.length}</div>
          <div className="text-sm text-gray-600">Artigos Disponíveis</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Enviar Artigo para Assinantes</h3>
        <div className="space-y-3">
          {artigos.map((artigo) => (
            <div key={artigo.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">{artigo.titulo}</p>
                <p className="text-xs text-gray-500">
                  {new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => enviarMutation.mutate(artigo.id)}
                disabled={enviarMutation.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}