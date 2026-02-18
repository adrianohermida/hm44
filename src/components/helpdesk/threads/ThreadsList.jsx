import React from 'react';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ThreadsList({ threads = [] }) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-[var(--text-tertiary)]">
          Nenhuma discussão interna
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map(thread => (
        <div key={thread.id} className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center text-sm font-semibold">
              {thread.autor_nome?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {thread.autor_nome}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {format(new Date(thread.created_date), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
            {thread.mensagem}
          </p>
          {thread.mencoes?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {thread.mencoes.map((mention, idx) => (
                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  @{mention}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}