import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ArtigoFormModal({ artigo, onClose, escritorioId }) {
  const [formData, setFormData] = useState(artigo || {
    titulo: '',
    conteudo: '',
    categoria: '',
    tags: []
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (artigo) {
        return base44.entities.BaseConhecimento.update(artigo.id, data);
      }
      return base44.entities.BaseConhecimento.create({ ...data, escritorio_id: escritorioId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['base-conhecimento']);
      toast.success('Artigo salvo');
      onClose();
    }
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{artigo ? 'Editar' : 'Novo'} Artigo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
          </div>
          <div>
            <Label>Conteúdo (Markdown)</Label>
            <Textarea 
              value={formData.conteudo} 
              onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
              className="min-h-[300px] font-mono"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}