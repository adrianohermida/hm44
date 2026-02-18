import React from 'react';
import { Calendar } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function TeamCalendarSelector({ calendars, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        IDs de Calendários de Equipe
      </label>
      <Textarea
        placeholder="cole IDs de calendários Google, um por linha"
        value={calendars}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm min-h-[80px] font-mono"
      />
      <p className="text-xs text-[var(--text-tertiary)]">
        Configure calendários compartilhados do Google que contêm eventos da equipe
      </p>
    </div>
  );
}