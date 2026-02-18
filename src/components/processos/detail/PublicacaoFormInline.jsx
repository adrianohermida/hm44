import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Check } from 'lucide-react';

export default function PublicacaoFormInline({ onSave, onCancel }) {
  const [data, setData] = React.useState({ tipo: 'outro' });

  return (
    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border-2 border-[var(--brand-primary)] space-y-2">
      <Select value={data.tipo} onValueChange={v => setData({...data, tipo: v})}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="intimacao">Intimação</SelectItem>
          <SelectItem value="sentenca">Sentença</SelectItem>
          <SelectItem value="despacho">Despacho</SelectItem>
          <SelectItem value="acordao">Acórdão</SelectItem>
          <SelectItem value="outro">Outro</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input type="date" placeholder="Data" onChange={e => setData({...data, data: e.target.value})} />
        <Input placeholder="Fonte" value={data.fonte || ''} onChange={e => setData({...data, fonte: e.target.value})} />
      </div>
      <Textarea placeholder="Conteúdo da publicação" rows={3} value={data.conteudo || ''} onChange={e => setData({...data, conteudo: e.target.value})} />
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="ghost" onClick={onCancel}><X className="w-4 h-4" /></Button>
        <Button size="sm" onClick={() => onSave(data)}><Check className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}