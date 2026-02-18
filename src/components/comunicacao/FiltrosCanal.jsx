import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, User, UserX } from 'lucide-react';

const canais = [
  { id: 'todos', label: 'Todos', icon: MessageCircle },
  { id: 'chat_widget', label: 'Chat', icon: MessageCircle },
  { id: 'whatsapp', label: 'WhatsApp', icon: Phone }
];

const tipos = [
  { id: 'todas', label: 'Todas', icon: MessageCircle },
  { id: 'cliente', label: 'Clientes', icon: User },
  { id: 'visitante', label: 'Visitantes', icon: UserX }
];

export default function FiltrosCanal({ canal, setCanal, tipo, setTipo }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-[var(--text-secondary)] mb-2 font-medium">Canal</p>
        <div className="flex gap-2 flex-wrap">
          {canais.map(c => {
            const Icon = c.icon;
            const isActive = canal === c.id;
            return (
              <Button
                key={c.id}
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setCanal(c.id)}
                className={isActive ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]' : 'hover:bg-[var(--bg-secondary)]'}
              >
                <Icon className="w-3 h-3 mr-1.5" />
                <span className="text-xs">{c.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {tipo !== undefined && setTipo && (
        <div>
          <p className="text-xs text-[var(--text-secondary)] mb-2 font-medium">Tipo</p>
          <div className="flex gap-2 flex-wrap">
            {tipos.map(t => {
              const Icon = t.icon;
              const isActive = tipo === t.id;
              return (
                <Button
                  key={t.id}
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setTipo(t.id)}
                  className={isActive ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]' : 'hover:bg-[var(--bg-secondary)]'}
                >
                  <Icon className="w-3 h-3 mr-1.5" />
                  <span className="text-xs">{t.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}