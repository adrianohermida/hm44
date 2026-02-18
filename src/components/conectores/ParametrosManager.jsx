import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Edit2 } from 'lucide-react';

export default function ParametrosManager({ parametros = [], onChange, label }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    tipo: 'string',
    descricao: '',
    exemplo: '',
    localizacao: 'query'
  });

  const adicionar = () => {
    if (!form.nome?.trim()) return;
    
    const novoParam = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      descricao: form.descricao,
      exemplo: form.exemplo,
      localizacao: form.localizacao,
      opcoes_validas: []
    };

    if (editingIndex !== null) {
      // Editar
      const updated = [...parametros];
      updated[editingIndex] = novoParam;
      onChange(updated);
      setEditingIndex(null);
    } else {
      // Adicionar
      onChange([...parametros, novoParam]);
    }
    
    setForm({ nome: '', tipo: 'string', descricao: '', exemplo: '', localizacao: 'query' });
  };

  const remover = (idx) => {
    onChange(parametros.filter((_, i) => i !== idx));
  };

  const editar = (idx) => {
    const p = parametros[idx];
    setForm({
      nome: p.nome || '',
      tipo: p.tipo || 'string',
      descricao: p.descricao || '',
      exemplo: p.exemplo || '',
      localizacao: p.localizacao || 'query'
    });
    setEditingIndex(idx);
  };

  const cancelar = () => {
    setForm({ nome: '', tipo: 'string', descricao: '', exemplo: '', localizacao: 'query' });
    setEditingIndex(null);
  };

  return (
    <div className="space-y-3 border rounded-lg p-4">
      <label className="text-sm font-bold">{label}</label>
      
      <div className="grid grid-cols-2 gap-2">
        <Input 
          placeholder="Nome *"
          value={form.nome}
          onChange={e => setForm({...form, nome: e.target.value})}
        />
        <Select value={form.tipo} onValueChange={v => setForm({...form, tipo: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="integer">Integer</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="array">Array</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Input 
        placeholder="Descrição"
        value={form.descricao}
        onChange={e => setForm({...form, descricao: e.target.value})}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input 
          placeholder="Exemplo"
          value={form.exemplo}
          onChange={e => setForm({...form, exemplo: e.target.value})}
        />
        <Select value={form.localizacao} onValueChange={v => setForm({...form, localizacao: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="query">Query</SelectItem>
            <SelectItem value="path">Path</SelectItem>
            <SelectItem value="body">Body</SelectItem>
            <SelectItem value="header">Header</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={adicionar} disabled={!form.nome?.trim()}>
          <Plus className="w-4 h-4 mr-1" />
          {editingIndex !== null ? 'Atualizar' : 'Adicionar'}
        </Button>
        {editingIndex !== null && (
          <Button type="button" variant="ghost" size="sm" onClick={cancelar}>
            Cancelar
          </Button>
        )}
      </div>

      <div className="space-y-2 mt-3">
        {parametros.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between bg-[var(--bg-secondary)] p-2 rounded">
            <div className="flex-1 min-w-0">
              <code className="text-sm font-bold">{p.nome}</code>
              <div className="flex gap-1 mt-1">
                <Badge variant="outline" className="text-xs">{p.tipo}</Badge>
                <Badge variant="outline" className="text-xs">{p.localizacao}</Badge>
              </div>
            </div>
            <div className="flex gap-1">
              <Button type="button" size="sm" variant="ghost" onClick={() => editar(idx)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => remover(idx)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}