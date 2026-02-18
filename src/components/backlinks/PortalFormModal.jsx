import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function PortalFormModal({ portal, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    nome: '',
    url_portal: '',
    url_perfil: '',
    logo_url: '',
    categoria: 'juridico',
    ativo: true,
    exibir_home: true,
    ordem_exibicao: 0,
    domain_authority: null,
    total_backlinks: 0,
    observacoes: ''
  });

  useEffect(() => {
    if (portal) {
      setFormData(portal);
    }
  }, [portal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {portal ? 'Editar Portal' : 'Adicionar Portal'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nome do Portal *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
                placeholder="Ex: LiveCoins"
              />
            </div>
            <div>
              <Label>Categoria</Label>
              <Select 
                value={formData.categoria}
                onValueChange={(value) => setFormData({...formData, categoria: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juridico">Jurídico</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="midia">Mídia</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>URL do Portal *</Label>
            <Input
              type="url"
              value={formData.url_portal}
              onChange={(e) => setFormData({...formData, url_portal: e.target.value})}
              required
              placeholder="https://exemplo.com.br"
            />
          </div>

          <div>
            <Label>URL do Perfil/Autor</Label>
            <Input
              type="url"
              value={formData.url_perfil}
              onChange={(e) => setFormData({...formData, url_perfil: e.target.value})}
              placeholder="https://exemplo.com.br/autor/adriano-hermida"
            />
          </div>

          <div>
            <Label>URL do Logo</Label>
            <Input
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
              placeholder="https://exemplo.com.br/logo.png"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Domain Authority</Label>
              <Input
                type="number"
                value={formData.domain_authority || ''}
                onChange={(e) => setFormData({...formData, domain_authority: e.target.value ? Number(e.target.value) : null})}
                placeholder="0-100"
              />
            </div>
            <div>
              <Label>Total Backlinks</Label>
              <Input
                type="number"
                value={formData.total_backlinks}
                onChange={(e) => setFormData({...formData, total_backlinks: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label>Ordem Exibição</Label>
              <Input
                type="number"
                value={formData.ordem_exibicao}
                onChange={(e) => setFormData({...formData, ordem_exibicao: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
              />
              <Label>Portal Ativo</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.exibir_home}
                onCheckedChange={(checked) => setFormData({...formData, exibir_home: checked})}
              />
              <Label>Exibir no Home</Label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[var(--brand-primary)]">
              {portal ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}