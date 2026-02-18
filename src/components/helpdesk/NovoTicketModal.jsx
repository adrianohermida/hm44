import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import ClienteAutocomplete from './cliente/ClienteAutocomplete';
import ProcessoSelector from './processo/ProcessoSelector';

export default function NovoTicketModal({ open, onClose, escritorioId, contexto = null }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    cliente_email: '',
    cliente_nome: '',
    prioridade: 'media',
    categoria: 'duvida',
    canal: 'email',
    processo_id: ''
  });

  useEffect(() => {
    if (contexto?.processoId) {
      setFormData(prev => ({
        ...prev,
        titulo: `Suporte - ${contexto.processoTitulo || 'Processo'}`,
        descricao: `Ticket criado a partir do processo: ${contexto.processoTitulo || 'N/A'}`,
        processo_id: contexto.processoId
      }));
    } else {
      setCliente(null);
      setFormData({
        titulo: '',
        descricao: '',
        cliente_email: '',
        cliente_nome: '',
        prioridade: 'media',
        categoria: 'duvida',
        canal: 'email',
        processo_id: ''
      });
    }
  }, [contexto, open]);

  const createTicketMutation = useMutation({
    mutationFn: async (data) => {
      const ticketData = {
        ...data,
        escritorio_id: escritorioId,
        status: 'triagem',
        numero_ticket: `#${Math.floor(100000 + Math.random() * 900000)}`,
        ultima_atualizacao: new Date().toISOString()
      };
      const ticket = await base44.entities.Ticket.create(ticketData);
      
      // Notificar responsável se foi atribuído
      if (data.responsavel_email) {
        try {
          await base44.functions.invoke('helpdesk/notificarTicketAtribuido', {
            ticket_id: ticket.id,
            responsavel_email: data.responsavel_email,
            escritorio_id: escritorioId
          });
        } catch (error) {
          console.error('Erro ao notificar atribuição:', error);
        }
      }
      
      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Ticket criado com sucesso!');
      onClose();
      setFormData({
        titulo: '',
        descricao: '',
        cliente_email: '',
        cliente_nome: '',
        prioridade: 'media',
        categoria: 'duvida',
        canal: 'email',
        processo_id: ''
      });
    },
    onError: (error) => {
      toast.error('Erro ao criar ticket: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.cliente_email) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    createTicketMutation.mutate(formData);
  };

  if (contexto?.processoId) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Ticket - {contexto.processoTitulo}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 bg-blue-50 border border-blue-200 rounded p-3">
            <div className="text-sm font-semibold text-blue-900">
              ℹ️ Processo vinculado: {contexto.processoTitulo}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Ticket *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Resumo do problema ou solicitação"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Detalhes do ticket..."
              rows={4}
            />
          </div>



          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={formData.prioridade}
                onValueChange={(value) => setFormData({ ...formData, prioridade: value })}
              >
                <SelectTrigger id="prioridade">
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

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger id="categoria">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="duvida">Dúvida</SelectItem>
                  <SelectItem value="problema">Problema</SelectItem>
                  <SelectItem value="solicitacao">Solicitação</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="canal">Canal</Label>
              <Select
                value={formData.canal}
                onValueChange={(value) => setFormData({ ...formData, canal: value })}
              >
                <SelectTrigger id="canal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createTicketMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createTicketMutation.isPending}
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
            >
              {createTicketMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Ticket'
              )}
            </Button>
          </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Ticket</DialogTitle>
          <p id="novo-ticket-description" className="sr-only">
            Formulário para criar um novo ticket de atendimento
          </p>
        </DialogHeader>

        {!cliente ? (
          <div className="space-y-4">
            <Label>Selecione o Cliente *</Label>
            <ClienteAutocomplete
              onChange={(c) => {
                setCliente(c);
                setFormData({
                  ...formData,
                  cliente_email: c.email_principal,
                  cliente_nome: c.nome_completo || c.razao_social,
                  cliente_id: c.id
                });
              }}
              onCreate={() => {
                onClose();
                navigate(createPageUrl('EnviarTicket'));
              }}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="text-sm">
                ✓ Cliente: {cliente.nome_completo || cliente.razao_social}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {cliente.email_principal}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Ticket *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Resumo do problema ou solicitação"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Detalhes do ticket..."
                rows={4}
              />
            </div>

            <ProcessoSelector
              clienteId={cliente.id}
              onSelect={(processo) => setFormData({ ...formData, processo_id: processo.id })}
              onSkip={() => {}}
            />

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => setFormData({ ...formData, prioridade: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duvida">Dúvida</SelectItem>
                    <SelectItem value="problema">Problema</SelectItem>
                    <SelectItem value="solicitacao">Solicitação</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Canal</Label>
                <Select
                  value={formData.canal}
                  onValueChange={(value) => setFormData({ ...formData, canal: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCliente(null)}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={createTicketMutation.isPending}
                className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
              >
                {createTicketMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Ticket'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}