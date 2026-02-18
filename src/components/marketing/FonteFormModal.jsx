import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function FonteFormModal({ open, onClose, fonte, escritorioId }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nome: '',
    url_base: '',
    tipo: 'jurisprudencia',
    categoria: 'portal_juridico',
    confiabilidade: 'alta',
    ativo: true,
    usar_em_ia: true,
    descricao: ''
  });

  useEffect(() => {
    if (fonte) {
      setFormData(fonte);
    } else {
      setFormData({
        nome: '',
        url_base: '',
        tipo: 'jurisprudencia',
        categoria: 'portal_juridico',
        confiabilidade: 'alta',
        ativo: true,
        usar_em_ia: true,
        descricao: ''
      });
    }
  }, [fonte, open]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, escritorio_id: escritorioId };
      if (fonte) {
        return base44.entities.FonteConfiavel.update(fonte.id, payload);
      } else {
        return base44.entities.FonteConfiavel.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fontes-confiaveis']);
      toast.success('Fonte salva!');
      onClose();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{fonte ? 'Editar Fonte' : 'Nova Fonte Confiável'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nome da Fonte</Label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: STF - Supremo Tribunal Federal"
            />
          </div>

          <div>
            <Label>URL Base</Label>
            <Input
              value={formData.url_base}
              onChange={(e) => setFormData(prev => ({ ...prev, url_base: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select value={formData.tipo} onValueChange={(v) => setFormData(prev => ({ ...prev, tipo: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tribunal">Tribunal</SelectItem>
                  <SelectItem value="jurisprudencia">Jurisprudência</SelectItem>
                  <SelectItem value="noticia_juridica">Notícia Jurídica</SelectItem>
                  <SelectItem value="doutrina">Doutrina</SelectItem>
                  <SelectItem value="legislacao">Legislação</SelectItem>
                  <SelectItem value="orgao_oficial">Órgão Oficial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Categoria</Label>
              <Select value={formData.categoria} onValueChange={(v) => setFormData(prev => ({ ...prev, categoria: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stf">STF</SelectItem>
                  <SelectItem value="stj">STJ</SelectItem>
                  <SelectItem value="tst">TST</SelectItem>
                  <SelectItem value="trt">TRT</SelectItem>
                  <SelectItem value="tjsp">TJSP</SelectItem>
                  <SelectItem value="tjrj">TJRJ</SelectItem>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="estadual">Estadual</SelectItem>
                  <SelectItem value="trabalhista">Trabalhista</SelectItem>
                  <SelectItem value="portal_juridico">Portal Jurídico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Usar como referência para IA</Label>
            <Switch
              checked={formData.usar_em_ia}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, usar_em_ia: checked }))}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}