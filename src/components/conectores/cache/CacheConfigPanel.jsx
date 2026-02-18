import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import CacheStrategySelector from './CacheStrategySelector';

export default function CacheConfigPanel({ config, onChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cache</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Habilitar Cache</Label>
          <Switch 
            checked={config.enabled} 
            onCheckedChange={(v) => onChange({...config, enabled: v})}
          />
        </div>
        {config.enabled && (
          <CacheStrategySelector 
            value={config.strategy} 
            onChange={(v) => onChange({...config, strategy: v})}
          />
        )}
      </CardContent>
    </Card>
  );
}