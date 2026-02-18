import React, { useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGoogleCalendar } from '@/components/hooks/useGoogleCalendar';

export default function EventNoteEditor({ event, onSave }) {
  const [notes, setNotes] = useState(event.description || '');
  const [saving, setSaving] = useState(false);
  const { updateEvent } = useGoogleCalendar();

  const handleSave = async () => {
    setSaving(true);
    
    const result = await updateEvent(event.id, {
      summary: event.summary,
      description: notes,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      location: event.location
    });

    if (result.success) {
      onSave?.();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Notas de Acompanhamento
      </label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Adicione notas sobre este evento..."
        className="min-h-[100px]"
      />
      <Button
        onClick={handleSave}
        disabled={saving}
        size="sm"
        className="w-full"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? 'Salvando...' : 'Salvar Notas'}
      </Button>
    </div>
  );
}