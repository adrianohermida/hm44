import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RetryPolicyConfig({ config, onChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Política de Retry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs">Máximo de Tentativas</Label>
          <Input
            type="number"
            value={config.max_tentativas}
            onChange={(e) => onChange({ ...config, max_tentativas: parseInt(e.target.value) })}
            min="1"
            max="10"
          />
        </div>
        <div>
          <Label className="text-xs">Intervalo (ms)</Label>
          <Input
            type="number"
            value={config.intervalo_ms}
            onChange={(e) => onChange({ ...config, intervalo_ms: parseInt(e.target.value) })}
            min="1000"
            step="1000"
          />
        </div>
      </CardContent>
    </Card>
  );
}