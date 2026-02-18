import React from 'react';
import { Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExitPopupContent({ onClose }) {
  return (
    <div className="relative bg-white rounded-2xl p-8 max-w-md">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X className="w-6 h-6" />
      </button>
      
      <div className="text-center">
        <Gift className="w-16 h-16 text-[var(--brand-primary)] mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Espere! 🎁</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Antes de ir, baixe nosso Guia Gratuito de Negociação de Dívidas
        </p>
      </div>
    </div>
  );
}