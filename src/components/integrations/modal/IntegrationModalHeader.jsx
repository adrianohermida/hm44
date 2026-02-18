import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function IntegrationModalHeader({ integration }) {
  return (
    <DialogHeader>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl" role="img" aria-label={integration.name}>
          {integration.icon}
        </span>
        <DialogTitle className="text-[var(--text-primary)] text-xl">
          Conectar {integration.name}
        </DialogTitle>
      </div>
      <DialogDescription className="text-[var(--text-secondary)]">
        {integration.description}
      </DialogDescription>
    </DialogHeader>
  );
}