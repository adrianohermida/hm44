import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function AuditChecklist({ categoria, items }) {
  const passed = items.filter(i => i.status === 'pass').length;
  const failed = items.filter(i => i.status === 'fail').length;
  const warnings = items.filter(i => i.status === 'warning').length;
  const score = ((passed / items.length) * 100).toFixed(0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{categoria}</CardTitle>
          <Badge variant={score >= 90 ? 'success' : score >= 70 ? 'warning' : 'destructive'}>
            {score}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            {item.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
            {item.status === 'fail' && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
            {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
              <p className={item.status === 'fail' ? 'text-red-600 font-medium' : ''}>{item.label}</p>
              {item.details && <p className="text-[var(--text-tertiary)] mt-0.5">{item.details}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}