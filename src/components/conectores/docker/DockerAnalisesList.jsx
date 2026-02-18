import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import DockerAnaliseItem from './DockerAnaliseItem';

export default function DockerAnalisesList({ analises, selectedId, onSelect, selectedIds, onToggleSelect }) {
  if (!analises.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-[var(--text-tertiary)]">
          <p className="text-sm">Nenhuma análise ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Análises ({analises.length})</CardTitle>
          <Checkbox
            checked={selectedIds?.length === analises.length}
            onCheckedChange={(checked) => {
              if (checked) {
                onToggleSelect?.(analises.map(a => a.id));
              } else {
                onToggleSelect?.([]);
              }
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {analises.map(a => (
          <div key={a.id} className="flex items-center gap-2">
            <Checkbox
              checked={selectedIds?.includes(a.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onToggleSelect?.([...selectedIds, a.id]);
                } else {
                  onToggleSelect?.(selectedIds.filter(id => id !== a.id));
                }
              }}
            />
            <DockerAnaliseItem 
              analise={a}
              isSelected={a.id === selectedId}
              onClick={() => onSelect(a)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}