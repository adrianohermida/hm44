import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PropriedadesForm({ formData, onChange, departamentos, users }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Status</Label>
        <Select value={formData.status} onValueChange={(v) => onChange({...formData, status: v})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aberto">Aberto</SelectItem>
            <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
            <SelectItem value="aguardando_cliente">Aguardando Cliente</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
            <SelectItem value="fechado">Fechado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Prioridade</Label>
        <Select value={formData.prioridade} onValueChange={(v) => onChange({...formData, prioridade: v})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Departamento</Label>
        <Select value={formData.departamento_id} onValueChange={(v) => onChange({...formData, departamento_id: v})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar..." />
          </SelectTrigger>
          <SelectContent>
            {departamentos.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Responsável</Label>
        <Select value={formData.responsavel_email} onValueChange={(v) => onChange({...formData, responsavel_email: v})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar..." />
          </SelectTrigger>
          <SelectContent>
            {users.map(u => (
              <SelectItem key={u.email} value={u.email}>{u.full_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Tags (separadas por vírgula)</Label>
        <Input
          value={formData.tags}
          onChange={(e) => onChange({...formData, tags: e.target.value})}
          placeholder="tag1, tag2"
        />
      </div>
    </div>
  );
}