import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { CustomAvatar } from '@/components/ui/CustomAvatar';

const canalIcons = {
  chat_widget: MessageCircle,
  whatsapp: Phone
};

export default function ConversaCard({ conversa, isSelected, onClick }) {
  const Icon = canalIcons[conversa.canal] || MessageCircle;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected 
          ? 'bg-[var(--brand-primary-100)] border-l-4 border-[var(--brand-primary)]' 
          : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
      }`}
    >
      <div className="flex items-start gap-3">
        <CustomAvatar
          src={null}
          alt={conversa.cliente_nome}
          fallback={conversa.cliente_nome?.charAt(0) || 'C'}
          className="h-10 w-10 flex-shrink-0"
          fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] font-semibold"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-[var(--text-primary)] truncate">
              {conversa.cliente_nome}
            </h3>
            <Icon className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {conversa.ultima_mensagem}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            {conversa.ultima_atualizacao && format(new Date(conversa.ultima_atualizacao), 'dd/MM HH:mm')}
          </p>
        </div>
      </div>
    </button>
  );
}