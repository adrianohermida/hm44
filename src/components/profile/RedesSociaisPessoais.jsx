import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Instagram, Linkedin, Facebook, Twitter, Share2 } from 'lucide-react';

export default function RedesSociaisPessoais({ data, onChange, disabled }) {
  const redes = data.redes_sociais || {};

  const handleChange = (rede, value) => {
    onChange('redes_sociais', { ...redes, [rede]: value });
  };

  const redesConfig = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@usuario' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/...' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'facebook.com/...' },
    { key: 'twitter', label: 'Twitter/X', icon: Twitter, placeholder: '@usuario' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
          <Share2 className="w-5 h-5" />
          Redes Sociais
        </CardTitle>
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