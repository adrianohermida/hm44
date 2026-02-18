import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function WebhookConfigCard({ config, onChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Config Webhook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label>URL</Label>
          <Input 
            value={config.url} 
            onChange={(e) => onChange({...config, url: e.target.value})}
            placeholder="https://..."
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Ativo</Label>
          <Switch 
            checked={config.ativo} 
            onCheckedChange={(v) => onChange({...config, ativo: v})}
          />
        </div>
      </CardContent>
    </Card>
  );
}