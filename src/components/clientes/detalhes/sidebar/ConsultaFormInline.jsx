import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, X } from 'lucide-react';

export default function ConsultaFormInline({ onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    data_hora: '',
    tipo: 'presencial',
    local: '',
    observacoes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Data e Hora *
        </label>
        <Input
          type="datetime-local"
          value={formData.data_hora}
          onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
          required
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Tipo
        </label>
        <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="presencial">Presencial</SelectItem>
            <SelectItem value="videoconferencia">Videoconferência</SelectItem>
            <SelectItem value="telefone">Telefone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Local
        </label>
        <Input
          type="text"
          placeholder="Endereço ou link"
          value={formData.local}
          onChange={(e) => setFormData({ ...formData, local: e.target.value })}
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Observações
        </label>
        <Textarea
          placeholder="Detalhes da consulta..."
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          className="text-sm min-h-[60px]"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !formData.data_hora}
          className="flex-1"
        >
          {isSubmitting ? 'Salvando...' : 'Agendar'}
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