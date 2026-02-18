import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Key } from 'lucide-react';

const SECRETS_DISPONIVEIS = [
  { value: 'YOUTUBE_API_KEY', label: 'YouTube API Key' },
  { value: 'YOUTUBE_ANALYTICS_API_KEY', label: 'YouTube Analytics API Key' },
  { value: 'ESCAVADOR_API_TOKEN', label: 'Escavador API Token' },
  { value: 'DATAJUD_API_TOKEN', label: 'DataJud API Token' },
  { value: 'DIRECTDATA_API_KEY', label: 'DirectData API Key' },
  { value: 'SENDGRID_API_TOKEN', label: 'SendGrid API Token' },
  { value: 'BASE44_API_TOKEN', label: 'Base44 API Token' }
];

export default function SecretSelector({ value, onChange, placeholder = "Associar secret" }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-56">
        <Key className="w-4 h-4 mr-2" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Remover secret</SelectItem>
        {SECRETS_DISPONIVEIS.map(s => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}