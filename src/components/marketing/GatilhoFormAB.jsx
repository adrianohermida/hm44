import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GatilhoFormAB({ formData, onChange }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Teste A/B</CardTitle>
          <Switch
            checked={formData.teste_ab_ativo}
            onCheckedChange={(checked) => onChange('teste_ab_ativo', checked)}
          />
        </div>
      </CardHeader>
      {formData.teste_ab_ativo && (
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Título - Variação B</Label>
            <Input
              value={formData.headline_primaria_variacao_b || ''}
              onChange={(e) => onChange('headline_primaria_variacao_b', e.target.value)}
              placeholder="Título alternativo para teste"
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Descrição - Variação B</Label>
            <Input
              value={formData.headline_secundaria_variacao_b || ''}
              onChange={(e) => onChange('headline_secundaria_variacao_b', e.target.value)}
              placeholder="Descrição alternativa para teste"
              className="text-sm"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}