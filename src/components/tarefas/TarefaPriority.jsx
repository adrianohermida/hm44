import React from 'react';
import { AlertCircle } from 'lucide-react';

const colors = {
  baixa: 'text-blue-600 bg-blue-50',
  media: 'text-yellow-600 bg-yellow-50',
  alta: 'text-orange-600 bg-orange-50',
  urgente: 'text-red-600 bg-red-50'
};

export default function TarefaPriority({ priority }) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${colors[priority]}`}>
      <AlertCircle className="w-3 h-3" aria-hidden="true" />
      {priority}
    </div>
  );
}