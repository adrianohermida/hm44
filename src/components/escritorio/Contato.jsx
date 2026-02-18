import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, Globe, MessageSquare, Clock } from 'lucide-react';

export default function Contato({ data, onChange, disabled }) {
  const horario = data.horario_atendimento || {};

  const handleHorarioChange = (field, value) => {
    onChange('horario_atendimento', { ...horario, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--brand-primary)]">Contato</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--brand-primary)]" />
              Telefone
            </Label>
            <Input
              value={data.telefone || ''}
              onChange={(e) => onChange('telefone', e.target.value)}
              disabled={disabled}
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--brand-primary)]" />
              WhatsApp
            </Label>
            <Input
              value={data.whatsapp || ''}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--brand-primary)]" />
            Email
          </Label>
          <Input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--brand-primary)]" />
            Website
          </Label>
          <Input
            value={data.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="pt-4 border-t">
          <Label className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[var(--brand-primary)]" />
            Horário de Atendimento
          </Label>
          <div className="space-y-2">
            <Input
              placeholder="Ex: Segunda - Sexta"
              value={horario.dias || ''}
              onChange={(e) => handleHorarioChange('dias', e.target.value)}
              disabled={disabled}
            />
            <Input
              placeholder="Ex: 9:00 - 18:00"
              value={horario.horario || ''}
              onChange={(e) => handleHorarioChange('horario', e.target.value)}
              disabled={disabled}
            />
            <Input
              placeholder="Ex: horário de Brasília"
              value={horario.fuso || ''}
              onChange={(e) => handleHorarioChange('fuso', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}