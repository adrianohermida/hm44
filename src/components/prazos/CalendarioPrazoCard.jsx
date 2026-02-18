import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CalendarioPrazoCard({ prazo }) {
  const navigate = useNavigate();
  const diasRestantes = Math.ceil(
    (new Date(prazo.data_vencimento) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <button
      onClick={() => navigate(createPageUrl('ProcessoDetails') + `?id=${prazo.processo_id}`)}
      className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 w-full text-left"
    >
      <div className="flex items-center gap-2">
        {diasRestantes <= 3 && <AlertCircle className="w-4 h-4 text-red-500" />}
        <span className="text-sm">{prazo.titulo}</span>
      </div>
      <Badge variant="secondary">{prazo.tipo_prazo || prazo.tipo}</Badge>
    </button>
  );
}