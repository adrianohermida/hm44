import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

export default function TicketForm({ onSubmit, onCancel }) {
  const [data, setData] = useState({ titulo: '', descricao: '', prioridade: 'media', categoria: 'duvida' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-[var(--bg-primary)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Novo Ticket</h2>
          <button onClick={onCancel}><X className="w-5 h-5 text-[var(--text-secondary)]" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Título" value={data.titulo} onChange={e => setData({...data, titulo: e.target.value})} required />
          <textarea 
            placeholder="Descreva seu problema ou solicitação..."
            value={data.descricao}
            onChange={e => setData({...data, descricao: e.target.value})}
            className="w-full p-2 border border-[var(--border-primary)] rounded-md text-sm"
            rows={4}
            required
          />
          <Select value={data.categoria} onValueChange={v => setData({...data, categoria: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="duvida">Dúvida</SelectItem>
              <SelectItem value="problema">Problema</SelectItem>
              <SelectItem value="solicitacao">Solicitação</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1 bg-[var(--brand-primary)]">Criar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}