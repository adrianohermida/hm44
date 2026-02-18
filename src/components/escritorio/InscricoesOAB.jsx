import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Scale } from 'lucide-react';
import { toast } from 'sonner';

export default function InscricoesOAB({ escritorioId, disabled }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ numero: '', uf: '', tipo: 'sociedade', monitorar: true });
  const queryClient = useQueryClient();

  const { data: inscricoes = [] } = useQuery({
    queryKey: ['inscricoes-oab', escritorioId],
    queryFn: () => base44.entities.InscricaoOAB.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.InscricaoOAB.create({ ...data, escritorio_id: escritorioId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['inscricoes-oab']);
      setShowForm(false);
      setForm({ numero: '', uf: '', tipo: 'sociedade', monitorar: true });
      toast.success('Inscrição adicionada');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.InscricaoOAB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['inscricoes-oab']);
      toast.success('Inscrição removida');
    }
  });

  const toggleMonitorMutation = useMutation({
    mutationFn: ({ id, monitorar }) => base44.entities.InscricaoOAB.update(id, { monitorar }),
    onSuccess: () => queryClient.invalidateQueries(['inscricoes-oab'])
  });

  const UFs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[var(--brand-primary)]">
          <span className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Inscrições OAB
          </span>
          <Button 
            size="sm" 
            onClick={() => setShowForm(true)} 
            disabled={disabled}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div className="border rounded-lg p-4 space-y-3 bg-[var(--brand-primary-50)]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Número</Label>
                <Input value={form.numero} onChange={(e) => setForm({...form, numero: e.target.value})} />
              </div>
              <div>
                <Label>UF</Label>
                <Select value={form.uf} onValueChange={(v) => setForm({...form, uf: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UFs.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sociedade">Sociedade</SelectItem>
                  <SelectItem value="advogado">Advogado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.monitorar} onCheckedChange={(v) => setForm({...form, monitorar: v})} />
              <Label>Monitorar publicações</Label>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowForm(false)} variant="outline">Cancelar</Button>
              <Button size="sm" onClick={() => createMutation.mutate(form)} className="bg-[var(--brand-primary)]">Salvar</Button>
            </div>
          </div>
        )}

        {inscricoes.map((i) => (
          <div key={i.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-[var(--brand-primary-50)]">
            <div className="flex-1">
              <p className="font-semibold">OAB/{i.uf} {i.numero}</p>
              <p className="text-sm text-[var(--text-secondary)]">{i.tipo === 'sociedade' ? 'Sociedade' : 'Advogado'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={i.monitorar} 
                  onCheckedChange={(v) => toggleMonitorMutation.mutate({ id: i.id, monitorar: v })}
                  disabled={disabled}
                />
                <span className="text-xs">{i.monitorar ? 'Monitorando' : 'Inativo'}</span>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => deleteMutation.mutate(i.id)}
                disabled={disabled}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {inscricoes.length === 0 && !showForm && (
          <p className="text-center text-[var(--text-secondary)] py-4">Nenhuma inscrição cadastrada</p>
        )}
      </CardContent>
    </Card>
  );
}