import React from 'react';
import { MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ChatHistoryItem({ conversa, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors border border-[var(--border-primary)]"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-[var(--brand-primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm text-[var(--text-primary)] truncate">
              {conversa.cliente_nome}
            </h4>
            {conversa.ultima_atualizacao && (
              <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0">
                {format(new Date(conversa.ultima_atualizacao), 'dd/MM')}
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] truncate">
            {conversa.ultima_mensagem || 'Sem mensagens'}
          </p>
        </div>
      </div>
    </button>
  );
}