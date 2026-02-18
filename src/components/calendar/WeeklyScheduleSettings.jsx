import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ReminderSettings from './ReminderSettings';
import { base44 } from '@/api/base44Client';

export default function WeeklyScheduleSettings() {
  const [reminderTime, setReminderTime] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const user = await base44.auth.me();
    if (user.reminder_default_minutes) {
      setReminderTime(String(user.reminder_default_minutes));
    }
    setLoading(false);
  };

  const handleReminderChange = async (value) => {
    setReminderTime(value);
    await base44.auth.updateMe({
      reminder_default_minutes: parseInt(value)
    });
  };

  if (loading) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações da Agenda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReminderSettings value={reminderTime} onChange={handleReminderChange} />
      </CardContent>
    </Card>
  );
}