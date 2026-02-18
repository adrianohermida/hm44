import React from 'react';
import { Button } from '@/components/ui/button';

export default function AISuggestionsList({ suggestions, onSelect, onClose }) {
  return (
    <div className="border-t p-3 bg-blue-50 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Sugestões de IA:</span>
        <Button size="sm" variant="ghost" onClick={onClose}>Fechar</Button>
      </div>
      {suggestions.map((sug, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(sug)}
          className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-sm"
        >
          {sug}
        </button>
      ))}
    </div>
  );
}