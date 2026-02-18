import React from 'react';
import { Users, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function TeamEventFilter({ prefix, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Filtro de Eventos de Equipe
      </label>
      <Input
        placeholder="Ex: [EQUIPE], Team:"
        value={prefix}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm"
      />
      <p className="text-xs text-[var(--text-tertiary)]">
        Eventos com este prefixo no título serão considerados eventos de equipe
      </p>
    </div>
  );
}