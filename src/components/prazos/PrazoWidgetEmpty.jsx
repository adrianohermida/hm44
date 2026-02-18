import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function PrazoWidgetEmpty() {
  return (
    <div className="text-center py-6 text-[var(--text-secondary)]">
      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
      <p className="text-sm">Nenhum prazo urgente</p>
    </div>
  );
}