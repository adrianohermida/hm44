import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";

export default function BookingFormFieldsV2({ 
  user,
  selectedDate, 
  selectedSlot,
  appointmentType = 'avaliacao',
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    nome: user?.full_name || '',
    email: user?.email || '',
    telefone: '',
    mensagem: ''
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      if (!selectedSlot?.id) {
        throw new Error('Horário não selecionado corretamente');
      }
      return await base44.entities.CalendarAvailability.update(selectedSlot.id, {
        cliente_email: user.email,
        cliente_nome: user.full_name,
        status: 'agendado'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['minhas-consultas']);
      queryClient.invalidateQueries(['available-slots']);
      toast.success('Consulta agendada com sucesso! 🎉');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Erro ao agendar: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.telefone) {
      toast.error('Preencha o telefone');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--brand-primary)]/10 p-4 rounded-lg border border-[var(--brand-primary)]/20">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-[var(--brand-primary)]" />
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
              Resumo do Agendamento
            </p>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              {new Date(selectedDate).toLocaleDateString('pt-BR')} às {new Date(selectedSlot.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nome" className="text-[var(--text-primary)]">
            Nome Completo *
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            placeholder="Seu nome completo"
            disabled
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-[var(--text-primary)]">
            E-mail *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="seu@email.com"
            disabled
          />
        </div>

        <div>
          <Label htmlFor="telefone" className="text-[var(--text-primary)]">
            Telefone / WhatsApp *
          </Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
            placeholder="(11) 99999-9999"
            required
          />
        </div>

        <div>
          <Label htmlFor="mensagem" className="text-[var(--text-primary)]">
            Mensagem (opcional)
          </Label>
          <Textarea
            id="mensagem"
            value={formData.mensagem}
            onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
            placeholder="Descreva sua situação ou dúvida..."
            rows={3}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Agendando...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirmar Agendamento
            </>
          )}
        </Button>
      </form>
    </div>
  );
}