import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Merge } from 'lucide-react';

export default function DuplicatesList({ endpoints, onMerge }) {
  const duplicates = endpoints.reduce((acc, ep) => {
    const key = `${ep.metodo}-${ep.path}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ep);
    return acc;
  }, {});

  const groups = Object.entries(duplicates)
    .filter(([_, eps]) => eps.length > 1)
    .map(([key, eps]) => ({ key, endpoints: eps }));

  if (groups.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoints Duplicados ({groups.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {groups.map(({ key, endpoints: eps }) => (
          <div key={key} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{eps[0].metodo}</Badge>
                <code className="text-sm">{eps[0].path}</code>
                <Badge className="bg-yellow-600">{eps.length} duplicatas</Badge>
              </div>
              <Button size="sm" onClick={() => onMerge(eps)}>
                <Merge className="w-4 h-4 mr-2" />
                Mesclar
              </Button>
            </div>
            <div className="text-xs text-[var(--text-tertiary)]">
              {eps.map(e => e.nome).join(', ')}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}