import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Save, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TIPOS_FERIADO = ['Feriado Nacional', 'Feriado Estadual', 'Feriado Municipal', 'Feriado Forense', 'Recesso Forense', 'Suspensão de Expediente', 'Ponto Facultativo'];

export default function FeriadoForm({ feriado, escritorio_id, onClose }) {
  const [formData, setFormData] = useState(feriado || {
    data: '',
    descricao: '',
    tipo: 'Feriado Nacional',
    abrangencia: 'Nacional',
    estado_uf: '',
    cidade: '',
    tribunal: '',
    recorrente: false,
    data_inicio: '',
    data_fim: '',
    ato_publico_numero: '',
    documento_url: ''
  });
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, escritorio_id };
      if (feriado?.id) {
        return base44.entities.Feriado.update(feriado.id, payload);
      }
      return base44.entities.Feriado.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feriados']);
      toast.success(feriado ? 'Feriado atualizado' : 'Feriado criado');
      onClose();
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, documento_url: file_url });
      toast.success('Documento carregado');
    } catch (error) {
      toast.error('Erro ao carregar documento');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const temPeriodo = ['Recesso Forense', 'Suspensão de Expediente'].includes(formData.tipo);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-white my-8">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{feriado ? 'Editar' : 'Novo'} Feriado/Evento</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(v) => setFormData({...formData, tipo: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_FERIADO.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Abrangência *</Label>
                <Select value={formData.abrangencia} onValueChange={(v) => setFormData({...formData, abrangencia: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nacional">Nacional</SelectItem>
                    <SelectItem value="Estadual">Estadual</SelectItem>
                    <SelectItem value="Municipal">Municipal</SelectItem>
                    <SelectItem value="Tribunal Específico">Tribunal Específico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Descrição *</Label>
              <Input
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Ex: Natal, Recesso de fim de ano"
                required
              />
            </div>

            {temPeriodo ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data Início *</Label>
                  <Input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Data Fim *</Label>
                  <Input
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  required
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                id="recorrente"
                checked={formData.recorrente}
                onCheckedChange={(checked) => setFormData({...formData, recorrente: checked})}
              />
              <Label htmlFor="recorrente" className="text-sm">Feriado recorrente (anual)</Label>
            </div>

            {formData.abrangencia !== 'Nacional' && (
              <div className="grid grid-cols-2 gap-4">
                {formData.abrangencia === 'Estadual' && (
                  <div>
                    <Label>Estado (UF)</Label>
                    <Input
                      value={formData.estado_uf}
                      onChange={(e) => setFormData({...formData, estado_uf: e.target.value})}
                      placeholder="Ex: SP"
                    />
                  </div>
                )}
                {formData.abrangencia === 'Municipal' && (
                  <div>
                    <Label>Cidade</Label>
                    <Input
                      value={formData.cidade}
                      onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                    />
                  </div>
                )}
                {formData.abrangencia === 'Tribunal Específico' && (
                  <div>
                    <Label>Tribunal</Label>
                    <Input
                      value={formData.tribunal}
                      onChange={(e) => setFormData({...formData, tribunal: e.target.value})}
                      placeholder="Ex: TJSP"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <Label>Ato Público (opcional)</Label>
              <Input
                value={formData.ato_publico_numero}
                onChange={(e) => setFormData({...formData, ato_publico_numero: e.target.value})}
                placeholder="Ex: Lei 12.345/2023"
              />
            </div>

            <div>
              <Label>Documento (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={uploadingDoc}
                  className="flex-1"
                />
                {uploadingDoc && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saveMutation.isPending} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {feriado ? 'Atualizar' : 'Criar'} Feriado
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