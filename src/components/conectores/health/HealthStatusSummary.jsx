import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function HealthStatusSummary({ saudaveis, degradados, falhas }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="font-bold text-green-500">{saudaveis}</span>
      </div>
      <div className="flex items-center gap-1">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="font-bold text-amber-500">{degradados}</span>
      </div>
      <div className="flex items-center gap-1">
        <XCircle className="w-4 h-4 text-red-500" />
        <span className="font-bold text-red-500">{falhas}</span>
      </div>
    </div>
  );
}