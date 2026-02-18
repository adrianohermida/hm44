import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, RefreshCw, FileCheck } from 'lucide-react';
import DockerEndpointActions from './DockerEndpointActions';

export default function DockerEndpointCard({ endpoint, isSelected, onToggle, analiseId, onUpdate }) {
  const statusConfig = {
    NOVO: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Novo' },
    DUPLICADO: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Duplicado' },
    ATUALIZAR: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Atualizar' },
    OK: { icon: FileCheck, color: 'text-gray-600', bg: 'bg-gray-50', label: 'OK' }
  };

  const config = statusConfig[endpoint.status_comparacao] || statusConfig.NOVO;
  const Icon = config.icon;

  return (
    <Card className={`p-4 ${config.bg} border-l-4 ${isSelected ? 'ring-2 ring-[var(--brand-primary)]' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox checked={isSelected} onCheckedChange={onToggle} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{endpoint.metodo}</Badge>
            <code className="text-sm font-mono">{endpoint.path}</code>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <p className="text-sm font-medium mb-1">{endpoint.nome}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{endpoint.descricao}</p>
          {endpoint.parametros_obrigatorios?.length > 0 && (
            <p className="text-xs mt-2">
              <strong>Parâmetros:</strong> {endpoint.parametros_obrigatorios.map(p => p.nome || p).join(', ')}
            </p>
          )}
        </div>
        <DockerEndpointActions 
          endpoint={endpoint}
          analiseId={analiseId}
          onUpdate={onUpdate}
        />
      </div>
    </Card>
  );
}