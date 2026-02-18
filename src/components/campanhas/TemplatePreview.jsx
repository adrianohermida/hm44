import React from 'react';
import { Card } from '@/components/ui/card';

export default function TemplatePreview({ html }) {
  return (
    <Card className="p-6 bg-[var(--bg-primary)]">
      <div className="border border-[var(--border-primary)] rounded-lg overflow-hidden">
        <div className="bg-[var(--bg-tertiary)] px-4 py-2 text-sm text-[var(--text-secondary)] border-b border-[var(--border-primary)]">
          Preview do Email
        </div>
        <div 
          className="p-6 bg-white"
          dangerouslySetInnerHTML={{ __html: html || '<p class="text-gray-400">Adicione conteúdo HTML para visualizar...</p>' }}
        />
      </div>
    </Card>
  );
}