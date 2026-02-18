import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TeamEventFilter from './TeamEventFilter';
import TeamCalendarSelector from './TeamCalendarSelector';

export default function TeamEventConfig() {
  const [prefix, setPrefix] = useState('');
  const [calendars, setCalendars] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const user = await base44.auth.me();
    setPrefix(user.team_event_prefix || '[EQUIPE]');
    setCalendars(user.team_calendar_ids || '');
  };

  const handleSave = async () => {
    setLoading(true);
    await base44.auth.updateMe({
      team_event_prefix: prefix,
      team_calendar_ids: calendars
    });
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Configuração de Eventos de Equipe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TeamEventFilter prefix={prefix} onChange={setPrefix} />
        <TeamCalendarSelector calendars={calendars} onChange={setCalendars} />
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Salvando...' : 'Salvar Configuração'}
        </Button>
      </CardContent>
    </Card>
  );
}