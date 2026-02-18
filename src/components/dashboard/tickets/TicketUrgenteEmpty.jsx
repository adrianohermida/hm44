import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function TicketUrgenteEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
        <AlertCircle className="w-6 h-6 text-green-600" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] text-center">
        Nenhum ticket urgente
      </p>
    </div>
  );
}