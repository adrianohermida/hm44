import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function SecretBadge({ isSet, required }) {
  if (isSet) {
    return (
      <Badge className="bg-green-500/20 text-green-400">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Configurado
      </Badge>
    );
  }
  
  return (
    <Badge className={required ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}>
      <XCircle className="w-3 h-3 mr-1" />
      {required ? 'OBRIGATÓRIO' : 'Não configurado'}
    </Badge>
  );
}