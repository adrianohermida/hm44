import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileType, CheckCircle2 } from 'lucide-react';

export default function FormatoDetector({ formato, delimitador, encoding }) {
  return (
    <Card className="p-3 bg-[var(--bg-secondary)]">
      <div className="flex items-center gap-2 mb-2">
        <FileType className="w-4 h-4 text-[var(--brand-primary)]" />
        <span className="text-sm font-medium">Formato Detectado</span>
      </div>
      <div className="flex gap-2">
        <Badge>{formato}</Badge>
        {delimitador && <Badge variant="outline">Sep: {delimitador === '\t' ? 'TAB' : delimitador}</Badge>}
        {encoding && <Badge variant="outline">{encoding}</Badge>}
        <CheckCircle2 className="w-4 h-4 text-[var(--brand-success)] ml-auto" />
      </div>
    </Card>
  );
}