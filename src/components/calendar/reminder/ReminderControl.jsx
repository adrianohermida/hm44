import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ReminderControl({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--text-secondary)]">Lembrar</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Sem lembrete</SelectItem>
          <SelectItem value="15">15 minutos</SelectItem>
          <SelectItem value="30">30 minutos</SelectItem>
          <SelectItem value="60">1 hora</SelectItem>
          <SelectItem value="120">2 horas</SelectItem>
          <SelectItem value="1440">1 dia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}