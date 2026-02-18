import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function NovoAgendamentoModal({ open, onClose, user, escritorioId }) {
  const [dataHora, setDataHora] = useState("");
  const [tipo, setTipo] = useState("consulta_juridica");
  const [modalidade, setModalidade] = useState("presencial");
  const [observacoes, setObservacoes] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.CalendarAvailability.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['meus-agendamentos']);
      toast.success('Agendamento solicitado! Nossa equipe entrará em contato para confirmar.');
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast.error('Erro ao criar agendamento: ' + error.message);
    }
  });

  const resetForm = () => {
    setDataHora("");
    setTipo("consulta_juridica");
    setModalidade("presencial");
    setObservacoes("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!dataHora) {
      toast.error('Selecione data e hora');
      return;
    }

    createMutation.mutate({
      cliente_email: user.email,
      cliente_nome: user.full_name,
      data_hora: dataHora,
      tipo_consulta: tipo,
      modalidade,
      observacoes,
      status: 'agendada',
      ...(escritorioId ? { escritorio_id: escritorioId } : {})
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="dataHora">Data e Hora *</Label>
            <Input
              id="dataHora"
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de Consulta</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta_juridica">Consulta Jurídica</SelectItem>
                <SelectItem value="acompanhamento">Acompanhamento de Caso</SelectItem>
                <SelectItem value="orientacao">Orientação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="modalidade">Modalidade</Label>
            <Select value={modalidade} onValueChange={setModalidade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="videoconferencia">Videoconferência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Informações adicionais sobre o agendamento..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Agendando...' : 'Solicitar Agendamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}