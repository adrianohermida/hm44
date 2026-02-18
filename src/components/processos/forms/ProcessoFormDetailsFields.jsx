import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProcessoFormDetailsFields({ form, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Tribunal</Label>
        <Input 
          value={form.tribunal} 
          onChange={(e) => onChange({ ...form, tribunal: e.target.value })} 
          className="bg-[var(--bg-primary)] border-[var(--border-primary)]" 
        />
      </div>
      <div>
        <Label>Classe</Label>
        <Input 
          value={form.classe} 
          onChange={(e) => onChange({ ...form, classe: e.target.value })} 
          className="bg-[var(--bg-primary)] border-[var(--border-primary)]" 
        />
      </div>
    </div>
  );
}