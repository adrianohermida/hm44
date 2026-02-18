import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function MetricasCard({ label, valor, icon: Icon }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-[var(--brand-primary)]" />}
          <div>
            <p className="text-sm text-[var(--text-tertiary)]">{label}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{valor}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}