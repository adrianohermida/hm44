import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Mail, FileText } from 'lucide-react';

export default function ClienteCard({ cliente, onClick, selected, onToggle }) {
  const getStatusColor = (status) => {
    const colors = {
      ativo: 'bg-[var(--brand-success)]',
      inativo: 'bg-[var(--brand-text-tertiary)]',
      potencial: 'bg-[var(--brand-info)]',
      arquivado: 'bg-[var(--brand-text-secondary)]'
    };
    return colors[status] || 'bg-[var(--brand-text-tertiary)]';
  };

  return (
    <Card 
      className="p-4 hover:shadow-lg transition-shadow border border-[var(--border-primary)] relative"
    >
      {onToggle && (
        <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected}
            onCheckedChange={onToggle}
          />
        </div>
      )}
      <div className="flex items-start gap-3 cursor-pointer" onClick={onClick}>
        <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-[var(--brand-primary-700)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">{cliente.nome_completo}</h3>
            <Badge className={`${getStatusColor(cliente.status)} text-white text-xs`}>
              {cliente.status}
            </Badge>
          </div>
          <div className="mt-2 space-y-1">
            {cliente.email && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Mail className="w-4 h-4" />
                <span className="truncate">{cliente.email}</span>
              </div>
            )}
            {cliente.telefone && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Phone className="w-4 h-4" />
                <span>{cliente.telefone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}