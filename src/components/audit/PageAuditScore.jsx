import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function PageAuditScore({ pageName, score, critical, warnings }) {
  const color = score >= 90 ? 'text-green-600' : score >= 70 ? 'text-yellow-600' : 'text-red-600';
  const Icon = score >= 90 ? CheckCircle2 : score >= 70 ? AlertTriangle : XCircle;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{pageName}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--text-tertiary)]">
                {critical} críticos • {warnings} avisos
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${color}`}>{score}</span>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}