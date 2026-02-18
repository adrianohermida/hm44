import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Save } from 'lucide-react';
import { toast } from 'sonner';

const TIPOS_PRAZO = ['Contestação', 'Recurso', 'Apelação', 'Manifestação', 'Contrarrazões', 'Agravo', 'Embargos', 'Réplica', 'Outro'];
const TIPOS_CONTAGEM = ['Disponibilização DJE', 'Juntada de mandado', 'Intimação SAJ', 'Citação SAJ'];

export default function RegrasPrazoForm({ regra, escritorio_id, onClose, onSuccess }) {
  const [formData, setFormData] = useState(regra || {
    nome: '',
    tipo_prazo: 'Contestação',
    dias_prazo: 15,
    tipo_contagem: 'Disponibilização DJE',
    tipo_dias: 'Dias Úteis',
    tribunal: '',
    instancia: '',
    area_direito: '',
    base_legal: '',
    ativa: true,
    observacoes: ''
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, escritorio_id };
      if (regra?.id) {
        return base44.entities.RegraPrazo.update(regra.id, payload);
      }
      return base44.entities.RegraPrazo.create(payload);
    },
    onSuccess: () => {
      toast.success(regra ? 'Regra atualizada' : 'Regra criada');
      onSuccess();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{regra ? 'Editar' : 'Nova'} Regra de Prazo</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome da Regra *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Ex: Contestação TJSP Cível"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Prazo *</Label>
                <Select value={formData.tipo_prazo} onValueChange={(v) => setFormData({...formData, tipo_prazo: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_PRAZO.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Quantidade de Dias *</Label>
                <Input
                  type="number"
                  value={formData.dias_prazo}
                  onChange={(e) => setFormData({...formData, dias_prazo: parseInt(e.target.value)})}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Contagem *</Label>
                <Select value={formData.tipo_contagem} onValueChange={(v) => setFormData({...formData, tipo_contagem: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_CONTAGEM.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de Dias *</Label>
                <Select value={formData.tipo_dias} onValueChange={(v) => setFormData({...formData, tipo_dias: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dias Úteis">Dias Úteis</SelectItem>
                    <SelectItem value="Dias Corridos">Dias Corridos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tribunal (opcional)</Label>
                <Input
                  value={formData.tribunal}
                  onChange={(e) => setFormData({...formData, tribunal: e.target.value})}
                  placeholder="Ex: TJSP"
                />
              </div>

              <div>
                <Label>Área do Direito (opcional)</Label>
                <Input
                  value={formData.area_direito}
                  onChange={(e) => setFormData({...formData, area_direito: e.target.value})}
                  placeholder="Ex: Cível"
                />
              </div>
            </div>

            <div>
              <Label>Base Legal (opcional)</Label>
              <Textarea
                value={formData.base_legal}
                onChange={(e) => setFormData({...formData, base_legal: e.target.value})}
                placeholder="Art. 335 CPC, Art. 183..."
                rows={2}
              />
            </div>

            <div>
              <Label>Observações</Label>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label>Regra Ativa</Label>
              <Switch
                checked={formData.ativa}
                onCheckedChange={(v) => setFormData({...formData, ativa: v})}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saveMutation.isPending} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {regra ? 'Atualizar' : 'Criar'} Regra
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}