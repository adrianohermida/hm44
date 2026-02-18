import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react';

export default function DadosPessoais({ data, onChange, disabled }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
          <User className="w-5 h-5" />
          Dados Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Nome Completo</Label>
          <Input value={data.full_name || ''} disabled className="bg-gray-50" />
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Nome não pode ser alterado</p>
        </div>

        <div>
          <Label>Email</Label>
          <Input value={data.email || ''} disabled className="bg-gray-50" />
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Email não pode ser alterado</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>CPF</Label>
            <Input
              value={data.cpf || ''}
              onChange={(e) => onChange('cpf', e.target.value)}
              disabled={disabled}
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input
              value={data.whatsapp || ''}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              disabled={disabled}
              placeholder="+55 (11) 99999-9999"
            />
          </div>
        </div>

        <div>
          <Label>Telefone</Label>
          <Input
            value={data.telefone || ''}
            onChange={(e) => onChange('telefone', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label>Biografia</Label>
          <Textarea
            value={data.bio || ''}
            onChange={(e) => onChange('bio', e.target.value)}
            disabled={disabled}
            rows={3}
            placeholder="Conte um pouco sobre você..."
          />
        </div>
      </CardContent>
    </Card>
  );
}