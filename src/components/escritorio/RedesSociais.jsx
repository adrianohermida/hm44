import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Instagram, Linkedin, Facebook, Twitter, Youtube } from 'lucide-react';

export default function RedesSociais({ data, onChange, disabled }) {
  const redes = data.redes_sociais || {};

  const handleChange = (rede, value) => {
    onChange('redes_sociais', { ...redes, [rede]: value });
  };

  const redesConfig = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@usuario' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/company/...' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'facebook.com/...' },
    { key: 'twitter', label: 'Twitter/X', icon: Twitter, placeholder: '@usuario' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'youtube.com/@canal' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--brand-primary)]">Redes Sociais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {redesConfig.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key}>
            <Label className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-[var(--brand-primary)]" />
              {label}
            </Label>
            <Input
              value={redes[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}