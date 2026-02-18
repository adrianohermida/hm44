import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function GatilhoCard({ gatilho, onEdit, onDelete, onToggleStatus }) {
  const statusColor = {
    rascunho: 'bg-gray-500',
    ativo: 'bg-green-500',
    inativo: 'bg-red-500'
  };

  const tipoLabel = {
    hero: 'Hero (Home)',
    cta: 'CTA',
    beneficio: 'Benefício',
    prova_social: 'Prova Social'
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: gatilho.status === 'ativo' ? 'var(--brand-primary)' : 'var(--border-primary)' }}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {tipoLabel[gatilho.tipo_conteudo]}
              </Badge>
              <Badge className={statusColor[gatilho.status]}>
                {gatilho.status}
              </Badge>
            </div>
            <CardTitle className="text-lg">{gatilho.headline_primaria}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button onClick={onEdit} size="sm" variant="outline">
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              onClick={onToggleStatus} 
              size="sm" 
              variant="outline"
              title={gatilho.status === 'ativo' ? 'Desativar' : 'Ativar'}
            >
              {gatilho.status === 'ativo' ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button onClick={onDelete} size="sm" variant="destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {gatilho.headline_secundaria && (
          <p className="text-sm text-[var(--text-secondary)]">{gatilho.headline_secundaria}</p>
        )}
        
        {gatilho.badge_texto && (
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] px-3 py-1 rounded-full text-xs">
            {gatilho.badge_texto}
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          {gatilho.cta_primario_texto && (
            <Badge variant="secondary">{gatilho.cta_primario_texto}</Badge>
          )}
          {gatilho.cta_secundario_texto && (
            <Badge variant="secondary">{gatilho.cta_secundario_texto}</Badge>
          )}
        </div>

        {(gatilho.estatistica_1_valor || gatilho.estatistica_2_valor || gatilho.estatistica_3_valor) && (
          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t">
            {gatilho.estatistica_1_valor && (
              <div>
                <p className="font-bold text-sm">{gatilho.estatistica_1_valor}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{gatilho.estatistica_1_label}</p>
              </div>
            )}
            {gatilho.estatistica_2_valor && (
              <div>
                <p className="font-bold text-sm">{gatilho.estatistica_2_valor}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{gatilho.estatistica_2_label}</p>
              </div>
            )}
            {gatilho.estatistica_3_valor && (
              <div>
                <p className="font-bold text-sm">{gatilho.estatistica_3_valor}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{gatilho.estatistica_3_label}</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t">
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Impressões</p>
            <p className="font-bold">{gatilho.metricas_ab?.impressoes || 0}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Cliques</p>
            <p className="font-bold">{gatilho.metricas_ab?.cliques || 0}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)]">Conv %</p>
            <p className="font-bold text-[var(--brand-primary)]">{(gatilho.metricas_ab?.taxa_conversao || 0).toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}