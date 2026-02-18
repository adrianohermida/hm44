import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

export default function CalendarSettings({ user, onUpdate }) {
  const [form, setForm] = useState({
    horario_comercial_inicio: user?.horario_comercial_inicio || '09:00',
    horario_comercial_fim: user?.horario_comercial_fim || '18:00',
    team_calendar_ids: user?.team_calendar_ids || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe(form);
    await onUpdate();
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Calendário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Início</label>
            <Input type="time" value={form.horario_comercial_inicio} onChange={(e) => setForm({...form, horario_comercial_inicio: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Fim</label>
            <Input type="time" value={form.horario_comercial_fim} onChange={(e) => setForm({...form, horario_comercial_fim: e.target.value})} />
          </div>
        </div>
        {user?.role === 'admin' && (
          <div>
            <label className="text-sm font-medium mb-2 block">IDs Calendários de Equipe</label>
            <Textarea value={form.team_calendar_ids} onChange={(e) => setForm({...form, team_calendar_ids: e.target.value})} placeholder="Um ID por linha" className="min-h-[80px]" />
          </div>
        )}
        <Button onClick={handleSave} disabled={saving} className="w-full bg-[var(--brand-primary)]">
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </CardContent>
    </Card>
  );
}