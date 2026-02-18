import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

export default function EnvolvidosList({ envolvidos }) {
  return (
    <div className="space-y-2">
      {envolvidos.map((env, idx) => (
        <Card key={idx}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-[var(--brand-primary)]" />
              <div className="flex-1">
                <p className="font-medium text-sm">{env.nome}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{env.tipo}</Badge>
                  {env.polo && <Badge className="text-xs">{env.polo}</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}