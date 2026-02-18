import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

export default function AlertasWebhookConfig({ form, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-primary)]">
          Webhook CI/CD
        </span>
        <Switch 
          checked={form.ativar_webhook} 
          onCheckedChange={v => onChange({...form, ativar_webhook: v})} 
        />
      </div>
      
      {form.ativar_webhook && (
        <Input 
          placeholder="https://webhook.site/..." 
          value={form.webhook_url} 
          onChange={e => onChange({...form, webhook_url: e.target.value})} 
        />
      )}
    </div>
  );
}