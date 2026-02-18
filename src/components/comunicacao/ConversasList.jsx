import React from 'react';
import ConversaCard from './ConversaCard';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function ConversasList({ conversas, conversaSelecionada, onSelect, loading }) {
  if (loading) return <ResumeLoader />;

  return (
    <div className="space-y-2 overflow-y-auto">
      {conversas.map(conversa => (
        <ConversaCard
          key={conversa.id}
          conversa={conversa}
          isSelected={conversaSelecionada?.id === conversa.id}
          onClick={() => onSelect(conversa)}
        />
      ))}
      {conversas.length === 0 && (
        <p className="text-[var(--text-secondary)] text-center py-8 text-sm">
          Nenhuma conversa
        </p>
      )}
    </div>
  );
}