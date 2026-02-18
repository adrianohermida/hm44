import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuditChecklist from './AuditChecklist';
import PageAuditScore from './PageAuditScore';

export default function PageAuditReport({ pageName, audit, description }) {
  const totalItems = Object.values(audit).flat().length;
  const passed = Object.values(audit).flat().filter(i => i.status === 'pass').length;
  const failed = Object.values(audit).flat().filter(i => i.status === 'fail').length;
  const warnings = Object.values(audit).flat().filter(i => i.status === 'warning').length;
  const score = ((passed / totalItems) * 100).toFixed(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📄 {pageName}</span>
          <span className="text-sm font-normal text-[var(--text-tertiary)]">{description}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <PageAuditScore 
            pageName={pageName} 
            score={parseInt(score)} 
            critical={failed} 
            warnings={warnings} 
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(audit).map(([categoria, items]) => (
            <AuditChecklist key={categoria} categoria={categoria} items={items} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}