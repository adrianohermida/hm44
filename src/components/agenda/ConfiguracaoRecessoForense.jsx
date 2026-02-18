import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';

export default function ConfiguracaoRecessoForense({ config, onChange, disabled }) {
  const handleChange = (field, value) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
          <Calendar className="w-5 h-5" />
          Recesso Forense
        </CardTitle>
        <CardDescription>
          Configure o período de recesso forense e comportamento do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div>
            <Label className="font-medium">Ativar Recesso Forense</Label>
            <p className="text-sm text-[var(--text-secondary)]">
              Suspende agendamentos de 20/12 a 20/01
            </p>
          </div>
          <Switch
            checked={config.recesso_forense_ativo}
            onCheckedChange={(v) => handleChange('recesso_forense_ativo', v)}
            disabled={disabled}
          />
        </div>

        {config.recesso_forense_ativo && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={config.recesso_inicio || ''}
                  onChange={(e) => handleChange('recesso_inicio', e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div>
                <Label>Data de Fim</Label>
                <Input
                  type="date"
                  value={config.recesso_fim || ''}
                  onChange={(e) => handleChange('recesso_fim', e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>

            <div>
              <Label>Mensagem do Chatbot durante Recesso</Label>
              <Textarea
                value={config.mensagem_recesso_chatbot || ''}
                onChange={(e) => handleChange('mensagem_recesso_chatbot', e.target.value)}
                disabled={disabled}
                rows={3}
                placeholder="Estamos em recesso forense. Retornaremos em 20 de janeiro. Para urgências, abra um ticket."
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <Label className="font-medium">Permitir Tickets Urgentes</Label>
                <p className="text-sm text-[var(--text-secondary)]">
                  Clientes podem abrir tickets urgentes durante recesso
                </p>
              </div>
              <Switch
                checked={config.permitir_tickets_urgentes}
                onCheckedChange={(v) => handleChange('permitir_tickets_urgentes', v)}
                disabled={disabled}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}