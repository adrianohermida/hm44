import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ConectorStatus({ ativo }) {
  return (
    <Badge variant={ativo ? 'default' : 'secondary'} className="flex items-center gap-1">
      {ativo ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {ativo ? 'Ativo' : 'Inativo'}
    </Badge>
  );
}