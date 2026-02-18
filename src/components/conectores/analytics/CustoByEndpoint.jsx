import React from 'react';
import { Progress } from '@/components/ui/progress';

export default function CustoByEndpoint({ endpoints }) {
  const total = endpoints.reduce((sum, e) => sum + e.custo, 0);

  return (
    <div className="space-y-3">
      {endpoints.map((ep, i) => {
        const percent = (ep.custo / total) * 100;
        return (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>{ep.nome}</span>
              <span className="font-bold">R$ {ep.custo.toFixed(2)}</span>
            </div>
            <Progress value={percent} />
          </div>
        );
      })}
    </div>
  );
}