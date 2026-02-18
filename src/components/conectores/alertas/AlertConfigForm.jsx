import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AlertConfigForm({ config, onChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alertas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Breaking Changes</Label>
          <Switch 
            checked={config.breaking_changes} 
            onCheckedChange={(v) => onChange({...config, breaking_changes: v})}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Erros Críticos</Label>
          <Switch 
            checked={config.erros_criticos} 
            onCheckedChange={(v) => onChange({...config, erros_criticos: v})}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Latência Alta</Label>
          <Switch 
            checked={config.latencia_alta} 
            onCheckedChange={(v) => onChange({...config, latencia_alta: v})}
          />
        </div>
        {config.latencia_alta && (
          <div>
            <Label className="text-xs">Threshold (ms)</Label>
            <Input 
              type="number" 
              value={config.latencia_threshold} 
              onChange={(e) => onChange({...config, latencia_threshold: +e.target.value})}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}