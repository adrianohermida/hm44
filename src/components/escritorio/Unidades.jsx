import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, MapPin, Trash2, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Unidades({ escritorioId, disabled }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo: 'filial', exibir_contato: false });
  const queryClient = useQueryClient();

  const { data: unidades = [] } = useQuery({
    queryKey: ['unidades', escritorioId],
    queryFn: () => base44.entities.UnidadeEscritorio.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.UnidadeEscritorio.create({ ...data, escritorio_id: escritorioId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['unidades']);
      setShowForm(false);
      setForm({ tipo: 'filial', exibir_contato: false });
      toast.success('Unidade adicionada');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.UnidadeEscritorio.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['unidades']);
      toast.success('Unidade removida');
    }
  });

  const handleConvite = (email) => {
    // Implementar envio de link mágico
    toast.success('Convite enviado para ' + email);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[var(--brand-primary)]">
          <span className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Unidades
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
            <div>
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sede">Sede</SelectItem>
                  <SelectItem value="filial">Filial</SelectItem>
                  <SelectItem value="apoio">Apoio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Nome" value={form.nome || ''} onChange={(e) => setForm({...form, nome: e.target.value})} />
            <Input placeholder="Endereço completo" value={form.endereco_completo || ''} onChange={(e) => setForm({...form, endereco_completo: e.target.value})} />
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Cidade" value={form.cidade || ''} onChange={(e) => setForm({...form, cidade: e.target.value})} />
              <Input placeholder="UF" value={form.estado || ''} onChange={(e) => setForm({...form, estado: e.target.value})} maxLength={2} />
              <Input placeholder="CEP" value={form.cep || ''} onChange={(e) => setForm({...form, cep: e.target.value})} />
            </div>
            <Input placeholder="Email responsável" value={form.responsavel_email || ''} onChange={(e) => setForm({...form, responsavel_email: e.target.value})} />
            <div className="flex items-center gap-2">
              <Switch checked={form.exibir_contato} onCheckedChange={(v) => setForm({...form, exibir_contato: v})} />
              <Label>Exibir na página de contato</Label>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowForm(false)} variant="outline">Cancelar</Button>
              <Button size="sm" onClick={() => createMutation.mutate(form)} className="bg-[var(--brand-primary)]">Salvar</Button>
            </div>
          </div>
        )}

        {unidades.map((u) => (
          <div key={u.id} className="border rounded-lg p-3 space-y-2 hover:bg-[var(--brand-primary-50)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{u.nome}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]">
                    {u.tipo}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{u.endereco_completo}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{u.cidade}/{u.estado}</p>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => deleteMutation.mutate(u.id)}
                disabled={disabled}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {u.responsavel_email && (
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-[var(--brand-primary)]" />
                  <span>{u.responsavel_email}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleConvite(u.responsavel_email)}>
                  <Send className="w-3 h-3 mr-2" />
                  Convidar
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs">
              <Switch checked={u.exibir_contato} disabled size="sm" />
              <span>{u.exibir_contato ? 'Visível no site' : 'Oculto'}</span>
            </div>
          </div>
        ))}

        {unidades.length === 0 && !showForm && (
          <p className="text-center text-[var(--text-secondary)] py-4">Nenhuma unidade cadastrada</p>
        )}
      </CardContent>
    </Card>
  );
}