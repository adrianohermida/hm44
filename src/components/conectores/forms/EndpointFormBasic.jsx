import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import ProvedorSelector from '@/components/provedores/ProvedorSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EndpointFormBasic({ form, onChange }) {
  const { data: provedores = [] } = useQuery({
    queryKey: ['provedores-form'],
    queryFn: () => base44.entities.ProvedorAPI.list(),
    staleTime: 5 * 60 * 1000
  });

  const handleProvedorChange = (provedorId) => {
    const prov = provedores.find(p => p.id === provedorId);
    if (prov?.secret_name) {
      onChange({ ...form, provedor_id: provedorId });
      toast.success(`Secret herdado: ${prov.secret_name}`);
    } else {
      onChange({ ...form, provedor_id: provedorId });
    }
  };

  return (
    <div className="space-y-3">
      <Input 
        placeholder="Nome do endpoint" 
        value={form.nome} 
        onChange={e => onChange({...form, nome: e.target.value})} 
      />
      
      <ProvedorSelector 
        value={form.provedor_id} 
        onChange={handleProvedorChange} 
      />
      
      <Select 
        value={form.versao_api} 
        onValueChange={v => onChange({...form, versao_api: v})}
      >
        <SelectTrigger>
          <SelectValue placeholder="Versão da API" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="V1">Versão 1</SelectItem>
          <SelectItem value="V2">Versão 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}