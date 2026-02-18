import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({ 
  title = 'Nenhum item encontrado',
  description,
  action 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileQuestion className="w-12 h-12 text-[var(--text-tertiary)] mb-4" />
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-md">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}