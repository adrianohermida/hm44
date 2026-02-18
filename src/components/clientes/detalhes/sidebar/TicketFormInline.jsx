import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

export default function TicketFormInline({ onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    assunto: '',
    descricao: '',
    prioridade: 'media',
    categoria: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Assunto *
        </label>
        <Input
          type="text"
          placeholder="Ex: Dúvida sobre processo"
          value={formData.assunto}
          onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
          required
          className="text-sm"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Descrição *
        </label>
        <Textarea
          placeholder="Descreva o atendimento..."
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          required
          className="text-sm min-h-[60px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Prioridade
          </label>
          <Select value={formData.prioridade} onValueChange={(value) => setFormData({ ...formData, prioridade: value })}>
            <SelectTrigger className="text-sm">
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
          <label className="text-xs font-medium text-[var(--text-secondary)]">
            Categoria
          </label>
          <Input
            type="text"
            placeholder="Ex: Dúvida"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className="text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !formData.assunto || !formData.descricao}
          className="flex-1"
        >
          {isSubmitting ? 'Criando...' : 'Criar Ticket'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}