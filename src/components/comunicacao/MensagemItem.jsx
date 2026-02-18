import React from 'react';
import { format } from 'date-fns';
import { CustomAvatar } from '@/components/ui/CustomAvatar';

export default function MensagemItem({ mensagem }) {
  const isAdmin = mensagem.tipo_remetente === 'admin';

  return (
    <div className={`flex gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      {!isAdmin && (
        <CustomAvatar
          src={null}
          alt={mensagem.remetente_nome}
          fallback={mensagem.remetente_nome?.charAt(0) || 'C'}
          className="h-8 w-8 flex-shrink-0"
          fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] text-sm font-semibold"
        />
      )}
      <div className={`max-w-[70%] p-3 rounded-lg ${
        isAdmin 
          ? 'bg-[var(--brand-primary)] text-white' 
          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
      }`}>
        <p className="text-xs font-semibold mb-1 opacity-80">
          {mensagem.remetente_nome}
        </p>
        <p className="text-sm">{mensagem.conteudo}</p>
        <p className={`text-xs mt-1 ${isAdmin ? 'text-white/70' : 'text-[var(--text-tertiary)]'}`}>
          {format(new Date(mensagem.created_date), 'HH:mm')}
        </p>
      </div>
      {isAdmin && (
        <CustomAvatar
          src={null}
          alt={mensagem.remetente_nome}
          fallback={mensagem.remetente_nome?.charAt(0) || 'A'}
          className="h-8 w-8 flex-shrink-0"
          fallbackClassName="bg-[var(--brand-warning)] text-white text-sm font-semibold"
        />
      )}
    </div>
  );
}