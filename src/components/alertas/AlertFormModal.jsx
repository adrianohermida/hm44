import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AlertFormModal({ alerta, provedores, escritorioId, onClose }) {
  const [form, setForm] = useState({
    tipo: alerta?.tipo || 'latencia',
    provedor_id: alerta?.provedor_id || null,
    threshold_value: alerta?.threshold_value || 2000,
    comparacao: alerta?.comparacao || 'maior_que',
    canais: alerta?.canais || ['sistema'],
    destinatarios: alerta?.destinatarios || [],
    ativo: alerta?.ativo ?? true,
    frequencia_check_minutos: alerta?.frequencia_check_minutos || 60
  });

  const [emailInput, setEmailInput] = useState('');
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, escritorio_id: escritorioId };
      if (alerta?.id) {
        return base44.entities.AlertaConfig.update(alerta.id, payload);
      }
      return base44.entities.AlertaConfig.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['alertas']);
      toast.success('✅ Alerta salvo');
      onClose();
    },
    onError: (error) => {
      toast.error('❌ Erro ao salvar: ' + error.message);
    }
  });

  const handleAddEmail = () => {
    if (emailInput && !form.destinatarios.includes(emailInput)) {
      setForm({ ...form, destinatarios: [...form.destinatarios, emailInput] });
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email) => {
    setForm({ ...form, destinatarios: form.destinatarios.filter(e => e !== email) });
  };

  const handleToggleCanal = (canal) => {
    const canais = form.canais.includes(canal)
      ? form.canais.filter(c => c !== canal)
      : [...form.canais, canal];
    setForm({ ...form, canais });
  };

  const handleSave = () => {
    if (!form.tipo || !form.threshold_value) {
      toast.error('Tipo e threshold são obrigatórios');
      return;
    }
    saveMutation.mutate(form);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{alerta ? 'Editar' : 'Novo'} Alerta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label>Tipo de Alerta</Label>
            <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latencia">Latência Alta</SelectItem>
                <SelectItem value="taxa_sucesso">Taxa Sucesso Baixa</SelectItem>
                <SelectItem value="downtime">Downtime</SelectItem>
                <SelectItem value="quota_excedida">Quota Excedida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Provedor (opcional - vazio = todos)</Label>
            <Select value={form.provedor_id || ''} onValueChange={v => setForm({ ...form, provedor_id: v || null })}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os provedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Todos os provedores</SelectItem>
                {provedores.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Comparação</Label>
              <Select value={form.comparacao} onValueChange={v => setForm({ ...form, comparacao: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maior_que">Maior que ({">"}) </SelectItem>
                  <SelectItem value="menor_que">Menor que ({"<"})</SelectItem>
                  <SelectItem value="igual">Igual (=)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                Threshold {form.tipo === 'latencia' ? '(ms)' : form.tipo === 'taxa_sucesso' ? '(%)' : ''}
              </Label>
              <Input
                type="number"
                value={form.threshold_value}
                onChange={e => setForm({ ...form, threshold_value: Number(e.target.value) })}
                placeholder={form.tipo === 'latencia' ? '2000' : '95'}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Canais de Notificação</Label>
            <div className="space-y-2">
              {['sistema', 'email', 'slack'].map(canal => (
                <div key={canal} className="flex items-center gap-2">
                  <Checkbox
                    id={`canal-${canal}`}
                    checked={form.canais.includes(canal)}
                    onCheckedChange={() => handleToggleCanal(canal)}
                  />
                  <Label htmlFor={`canal-${canal}`} className="capitalize cursor-pointer">
                    {canal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {form.canais.includes('email') && (
            <div>
              <Label>Destinatários de Email</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="usuario@example.com"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                />
                <Button type="button" onClick={handleAddEmail}>Adicionar</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.destinatarios.map(email => (
                  <Badge key={email} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveEmail(email)}>
                    {email} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Frequência de Verificação (minutos)</Label>
            <Select 
              value={String(form.frequencia_check_minutos)} 
              onValueChange={v => setForm({ ...form, frequencia_check_minutos: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="360">6 horas</SelectItem>
                <SelectItem value="1440">24 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1"
              disabled={saveMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}