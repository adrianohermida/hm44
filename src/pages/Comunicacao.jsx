import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MessageSquare } from "lucide-react";
import ComunicacaoClienteList from "@/components/comunicacao/CommunicacaoClienteList";
import ComunicacaoClienteHeader from "@/components/comunicacao/ComunicacaoClienteHeader";
import ComunicacaoClienteChat from "@/components/comunicacao/ComunicacaoClienteChat";

export default function Comunicacao() {
  const queryClient = useQueryClient();
  const [selectedConversa, setSelectedConversa] = useState(null);
  const [showNewConversa, setShowNewConversa] = useState(false);

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    gcTime: 1000 * 60 * 5
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente-comunicacao', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const clientes = await base44.entities.Cliente.filter({ email: user.email });
      return clientes[0] || null;
    },
    enabled: !!user
  });

  const createConversaMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.Conversa.create({
        ...data,
        cliente_id: cliente.id,
        status: 'aberta'
      });
    },
    onSuccess: (novaConversa) => {
      queryClient.invalidateQueries(['conversas-cliente']);
      setSelectedConversa(novaConversa);
      setShowNewConversa(false);
    }
  });

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            Comunicação Direta
          </h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)]">
            Converse com nossa equipe de forma segura e organizada
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Lista de Conversas */}
          <div className="lg:col-span-1 space-y-4">
            <Button
              onClick={() => setShowNewConversa(!showNewConversa)}
              className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Conversa
            </Button>

            <ComunicacaoClienteList
              user={user}
              onSelectConversa={setSelectedConversa}
              selectedConversaId={selectedConversa?.id}
            />
          </div>

          {/* Main Content - Chat */}
          <div className="lg:col-span-3 space-y-4">
            {showNewConversa && (
              <Card className="bg-[var(--bg-elevated)]">
                <CardHeader>
                  <CardTitle className="text-base">Iniciar Nova Conversa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--text-primary)]">
                      Assunto
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dúvida sobre meu processo"
                      id="assunto"
                      className="w-full mt-1 px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--text-primary)]">
                      Descrição
                    </label>
                    <textarea
                      placeholder="Descreva sua questão..."
                      id="descricao"
                      rows={3}
                      className="w-full mt-1 px-3 py-2 border border-[var(--border-primary)] rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewConversa(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        const assunto = document.getElementById('assunto').value;
                        const descricao = document.getElementById('descricao').value;
                        if (!assunto || !descricao) {
                          alert('Preencha todos os campos');
                          return;
                        }
                        createConversaMutation.mutate({ assunto, descricao });
                      }}
                      disabled={createConversaMutation.isPending}
                    >
                      {createConversaMutation.isPending ? 'Criando...' : 'Criar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedConversa ? (
              <div className="space-y-4">
                <ComunicacaoClienteHeader conversa={selectedConversa} />
                <ComunicacaoClienteChat
                  conversaId={selectedConversa.id}
                  user={user}
                  clienteId={cliente?.id}
                />
              </div>
            ) : (
              <Card className="bg-[var(--bg-elevated)]">
                <CardContent className="py-16 text-center">
                  <MessageSquare className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3 opacity-50" />
                  <p className="text-[var(--text-secondary)]">
                    Selecione uma conversa ou crie uma nova
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}