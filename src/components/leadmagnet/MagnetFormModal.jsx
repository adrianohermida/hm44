import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

export default function MagnetFormModal({ magnet, open, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(magnet || {
    titulo: '',
    subtitulo: '',
    tipo: 'ebook',
    categoria: 'superendividamento',
    valor_percebido: '',
    exibir_valor: true,
    status: 'rascunho',
    arquivo_url: '',
    capa_url: ''
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      const payload = { ...data, escritorio_id: user.escritorio_id };
      
      if (magnet?.id) {
        return base44.entities.LeadMagnet.update(magnet.id, payload);
      }
      return base44.entities.LeadMagnet.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lead-magnets-admin']);
      toast.success(magnet?.id ? 'Material atualizado' : 'Material criado');
      onClose();
    },
    onError: (error) => {
      toast.error('Erro ao salvar: ' + error.message);
    }
  });

  const handleUploadFile = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data } = await base44.integrations.Core.UploadFile({ file });
    setFormData(prev => ({ ...prev, [field]: data.file_url }));
    toast.success('Arquivo enviado');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{magnet?.id ? 'Editar Material' : 'Novo Material'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Título *</Label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ex: Guia Completo de Renegociação"
            />
          </div>

          <div>
            <Label>Subtítulo</Label>
            <Textarea
              value={formData.subtitulo}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitulo: e.target.value }))}
              placeholder="Descrição breve do material"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ebook">E-book</SelectItem>
                  <SelectItem value="calculadora">Calculadora</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                  <SelectItem value="guia">Guia</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superendividamento">Superendividamento</SelectItem>
                  <SelectItem value="direito_consumidor">Direito Consumidor</SelectItem>
                  <SelectItem value="negociacao_dividas">Negociação Dívidas</SelectItem>
                  <SelectItem value="educacao_financeira">Educação Financeira</SelectItem>
                  <SelectItem value="processos_judiciais">Processos Judiciais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Valor Percebido</Label>
            <Input
              value={formData.valor_percebido}
              onChange={(e) => setFormData(prev => ({ ...prev, valor_percebido: e.target.value }))}
              placeholder="Ex: R$ 197,00"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.exibir_valor}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, exibir_valor: checked }))}
            />
            <Label>Exibir valor na página</Label>
          </div>

          <div>
            <Label>Arquivo (PDF)</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => handleUploadFile(e, 'arquivo_url')}
                className="flex-1"
              />
              {formData.arquivo_url && (
                <Button size="sm" variant="outline" onClick={() => window.open(formData.arquivo_url)}>
                  Ver
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label>Imagem de Capa</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadFile(e, 'capa_url')}
                className="flex-1"
              />
              {formData.capa_url && (
                <img src={formData.capa_url} alt="Capa" className="w-16 h-16 object-cover rounded" />
              )}
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => saveMutation.mutate(formData)}
            disabled={!formData.titulo || saveMutation.isPending}
            className="bg-[var(--brand-primary)]"
          >
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {magnet?.id ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}