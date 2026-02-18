import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';

export default function EnvolvidoNovo({ envolvido }) {
  return (
    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center gap-2 mb-2">
        <UserPlus className="w-4 h-4 text-green-600" />
        <p className="font-medium text-sm text-green-900">{envolvido.nome}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline" className="text-xs">{envolvido.tipo}</Badge>
        <Badge variant="outline" className="text-xs">{envolvido.polo}</Badge>
        {envolvido.principal && <Badge className="text-xs bg-green-600">Principal</Badge>}
      </div>
      {envolvido.documento?.numero && (
        <p className="text-xs text-green-700 mt-2">
          {envolvido.documento.tipo}: {envolvido.documento.numero}
        </p>
      )}
    </div>
  );
}