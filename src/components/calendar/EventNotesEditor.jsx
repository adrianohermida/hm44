import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save } from 'lucide-react';

export default function EventNotesEditor({ eventId, initialNotes, onSave }) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(eventId, notes);
    setSaving(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
        <FileText className="w-4 h-4" aria-hidden="true" />
        Notas de Acompanhamento
      </label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Adicione observações sobre esta reunião..."
        rows={3}
        aria-label="Notas de acompanhamento"
      />
      <Button onClick={handleSave} disabled={saving} size="sm" className="bg-[var(--brand-primary)]">
        <Save className="w-4 h-4 mr-2" aria-hidden="true" />
        Salvar Notas
      </Button>
    </div>
  );
}