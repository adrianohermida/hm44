import React from 'react';
import { Button } from '@/components/ui/button';

export default function ProcessoFormActions({ onCancel, submitLabel = 'Salvar' }) {
  return (
    <div className="flex gap-2 justify-end">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" className="bg-[var(--brand-primary)]">
        {submitLabel}
      </Button>
    </div>
  );
}