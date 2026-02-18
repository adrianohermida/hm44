import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProcessoEditBasicTab({ formData, setFormData }) {
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.list()
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Número CNJ *</Label>
          <Input
            value={formData.numero_cnj}
            onChange={e => setFormData({...formData, numero_cnj: e.target.value})}
            placeholder="0000000-00.0000.0.00.0000"
            required
          />
        </div>
        <div>
          <Label>Cliente</Label>
          <Select 
            value={formData.cliente_id} 
            onValueChange={v => setFormData({...formData, cliente_id: v})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Título do Processo</Label>
        <Input
          value={formData.titulo}
          onChange={e => setFormData({...formData, titulo: e.target.value})}
          placeholder="Ex: Ação de Cobrança contra..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={v => setFormData({...formData, status: v})}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Tribunal</Label>
          <Input
            value={formData.tribunal}
            onChange={e => setFormData({...formData, tribunal: e.target.value})}
            placeholder="Ex: TJSP"
          />
        </div>
        <div>
          <Label>Sistema</Label>
          <Input
            value={formData.sistema}
            onChange={e => setFormData({...formData, sistema: e.target.value})}
            placeholder="Ex: ESAJ, PJE"
          />
        </div>
      </div>

      <div>
        <Label>Observações</Label>
        <Textarea
          value={formData.observacoes}
          onChange={e => setFormData({...formData, observacoes: e.target.value})}
          rows={3}
          placeholder="Observações gerais sobre o processo..."
        />
      </div>
    </div>
  );
}