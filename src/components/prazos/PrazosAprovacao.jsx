import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

export default function PrazosAprovacao({ workspaceId, userRole, userEmail, darkMode = false }) {
  const [expandedPrazo, setExpandedPrazo] = useState(null);
  const [justificativa, setJustificativa] = useState('');
  const queryClient = useQueryClient();

  const isSupervisor = ['admin'].includes(userRole) || userEmail === 'adrianohermida@gmail.com';

  const { data: prazosPendentes = [] } = useQuery({
    queryKey: ['prazos-aprovacao', workspaceId],
    queryFn: () => base44.entities.Prazo.filter({
      escritorio_id: workspaceId,
      requer_aprovacao: true,
      status: 'pending'
    }, '-created_date', 50),
    enabled: !!workspaceId && isSupervisor
  });

  const aprovarMutation = useMutation({
    mutationFn: async ({ prazoId, aprovado, justificativa }) => {
      await base44.entities.Prazo.update(prazoId, {
        status: aprovado ? 'approved' : 'rejected',
        aprovado_por: userEmail,
        aprovado_em: new Date().toISOString(),
        motivo_rejeicao: aprovado ? null : justificativa
      });
    },
    onSuccess: (_, { aprovado }) => {
      queryClient.invalidateQueries(['prazos-aprovacao']);
      toast.success(aprovado ? 'Prazo aprovado!' : 'Prazo rejeitado');
      setExpandedPrazo(null);
      setJustificativa('');
    }
  });

  if (!isSupervisor) return null;

  if (prazosPendentes.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border">
        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
        <p className="text-gray-600">Nenhum prazo aguardando aprovação</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold">Prazos Aguardando Aprovação</h3>
        <Badge className="bg-amber-100 text-amber-700">{prazosPendentes.length}</Badge>
      </div>

      {prazosPendentes.map(prazo => (
        <div key={prazo.id} className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">{prazo.titulo}</p>
              <p className="text-sm text-gray-600">
                Vencimento: {moment(prazo.data_vencimento).format('DD/MM/YYYY')}
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-700">
              IA {prazo.confianca_ia}%
            </Badge>
          </div>

          {expandedPrazo === prazo.id && (
            <div className="space-y-3 pt-3 border-t">
              <Textarea
                placeholder="Justificativa (opcional para aprovação, obrigatória para rejeição)"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => aprovarMutation.mutate({ prazoId: prazo.id, aprovado: true, justificativa })}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprovar
                </Button>
                <Button
                  onClick={() => aprovarMutation.mutate({ prazoId: prazo.id, aprovado: false, justificativa })}
                  variant="outline"
                  className="flex-1"
                  disabled={!justificativa}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeitar
                </Button>
              </div>
            </div>
          )}

          {expandedPrazo !== prazo.id && (
            <Button
              onClick={() => setExpandedPrazo(prazo.id)}
              variant="outline"
              size="sm"
              className="w-full mt-3"
            >
              Avaliar Prazo
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}