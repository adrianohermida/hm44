import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import DockerEndpointCard from './DockerEndpointCard';
import DockerBulkActions from './DockerBulkActions';

export default function DockerEndpointsList({ endpoints, analiseId, onUpdate }) {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectByStatus = (status) => {
    const ids = endpoints.filter(e => e.status_comparacao === status).map((_, i) => i);
    setSelected(ids);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{endpoints.length} Endpoints Encontrados</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => selectByStatus('NOVO')}>
              Selecionar Novos ({endpoints.filter(e => e.status_comparacao === 'NOVO').length})
            </Button>
            <Button size="sm" variant="outline" onClick={() => selectByStatus('ATUALIZAR')}>
              Selecionar Atualizar ({endpoints.filter(e => e.status_comparacao === 'ATUALIZAR').length})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {selected.length > 0 && (
          <DockerBulkActions 
            selected={selected}
            endpoints={endpoints}
            analiseId={analiseId}
            onSuccess={() => {
              setSelected([]);
              onUpdate();
            }}
          />
        )}
        {endpoints.map((ep, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(idx)}
              onChange={() => toggleSelect(idx)}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <DockerEndpointCard
                endpoint={ep}
                isSelected={selected.includes(idx)}
                onToggle={() => toggleSelect(idx)}
                analiseId={analiseId}
                onUpdate={onUpdate}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}