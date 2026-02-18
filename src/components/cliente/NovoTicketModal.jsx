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

export default function NovoTicketModal({ open, onClose, user, escritorioId, contexto }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (contexto?.processoTitulo && open) {
      setTitulo(`Dúvida sobre: ${contexto.processoTitulo}`);
    }
  }, [contexto, open]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.Ticket.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meus-tickets'], exact: false });
      toast.success('Chamado criado com sucesso!');
      onClose();
      setTitulo("");
      setDescricao("");
      setPrioridade("media");
    },
    onError: (error) => {
      toast.error('Erro ao criar chamado: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!titulo || !descricao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    createMutation.mutate({
      titulo,
      descricao,
      prioridade,
      status: 'aberto',
      cliente_email: user.email,
      cliente_nome: user.full_name,
      escritorio_id: escritorioId,
      processo_id: contexto?.processoId || null
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Chamado de Suporte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Dúvida sobre andamento do processo"
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva sua dúvida ou problema..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={prioridade} onValueChange={setPrioridade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Criando...' : 'Criar Chamado'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}