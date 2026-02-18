import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function BlogTableHeader({ campo, label, ordenacao, onOrdenar }) {
  const isAtivo = ordenacao.campo === campo;
  const Icon = !isAtivo ? ArrowUpDown : ordenacao.direcao === 'asc' ? ArrowUp : ArrowDown;
  
  return (
    <th 
      className="text-left p-4 font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onOrdenar(campo)}
    >
      <div className="flex items-center gap-2">
        {label}
        <Icon className={`w-4 h-4 ${isAtivo ? 'text-[var(--brand-primary)]' : 'text-gray-400'}`} />
      </div>
    </th>
  );
}