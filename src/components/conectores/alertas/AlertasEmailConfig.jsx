import React from 'react';
import { Switch } from '@/components/ui/switch';
import EmailListInput from '../EmailListInput';

export default function AlertasEmailConfig({ form, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-primary)]">
          Alertas por Email
        </span>
        <Switch 
          checked={form.ativar_email} 
          onCheckedChange={v => onChange({...form, ativar_email: v})} 
        />
      </div>
      
      {form.ativar_email && (
        <EmailListInput 
          emails={form.email_destinatarios || []} 
          onChange={emails => onChange({...form, email_destinatarios: emails})} 
        />
      )}
    </div>
  );
}