import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';
import GatilhoFormAB from './GatilhoFormAB';
import GatilhoStatsToggles from './GatilhoStatsToggles';

export default function GatilhoFormModal({ gatilho, open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    tipo_conteudo: 'hero',
    headline_primaria: '',
    headline_secundaria: '',
    headline_primaria_variacao_b: '',
    headline_secundaria_variacao_b: '',
    teste_ab_ativo: false,
    cta_primario_texto: '',
    cta_primario_acao: '',
    cta_secundario_texto: '',
    cta_secundario_link: '',
    badge_texto: '',
    estatistica_1_valor: '',
    estatistica_1_label: '',
    estatistica_1_visivel: true,
    estatistica_2_valor: '',
    estatistica_2_label: '',
    estatistica_2_visivel: true,
    estatistica_3_valor: '',
    estatistica_3_label: '',
    estatistica_3_visivel: true,
    estatistica_4_valor: '',
    estatistica_4_label: '',
    estatistica_4_visivel: true,
    gatilho_mental: 'transformacao',
    status: 'rascunho',
    justificativa_legal: '',
    ...(gatilho || {})
  });

  useEffect(() => {
    if (gatilho) {
      setFormData({ ...formData, ...gatilho });
    }
  }, [gatilho]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{gatilho ? 'Editar Gatilho' : 'Novo Gatilho'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Conteúdo</Label>
              <Select value={formData.tipo_conteudo} onValueChange={(v) => setFormData({...formData, tipo_conteudo: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero (Página Inicial)</SelectItem>
                  <SelectItem value="cta">CTA (Call to Action)</SelectItem>
                  <SelectItem value="beneficio">Benefício</SelectItem>
                  <SelectItem value="prova_social">Prova Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
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

          <div>
            <Label>Título Principal</Label>
            <Input
              value={formData.headline_primaria || ""}
              onChange={(e) => setFormData({...formData, headline_primaria: e.target.value})}
              placeholder="Ex: Elimine Até 70% das Suas Dívidas Legalmente"
              required
            />
          </div>

          <div>
            <Label>Subtítulo/Descrição</Label>
            <Textarea
              value={formData.headline_secundaria}
              onChange={(e) => setFormData({...formData, headline_secundaria: e.target.value})}
              placeholder="Ex: Advocacia especializada em superendividamento..."
              rows={3}
            />
          </div>

          <div>
            <Label>Badge Destaque</Label>
            <Input
              value={formData.badge_texto || ""}
              onChange={(e) => setFormData({...formData, badge_texto: e.target.value})}
              placeholder="Ex: Lei 14.181/2021 • Vigente desde 2021"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Botões CTA</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTA Primário - Texto</Label>
                <Input
                  value={formData.cta_primario_texto}
                  onChange={(e) => setFormData({...formData, cta_primario_texto: e.target.value})}
                  placeholder="Ex: Calcular Gratuitamente"
                />
              </div>
              <div>
                <Label>CTA Primário - Ação</Label>
                <Input
                  value={formData.cta_primario_acao}
                  onChange={(e) => setFormData({...formData, cta_primario_acao: e.target.value})}
                  placeholder="Ex: scrollToCalculator"
                />
              </div>
              <div>
                <Label>CTA Secundário - Texto</Label>
                <Input
                  value={formData.cta_secundario_texto}
                  onChange={(e) => setFormData({...formData, cta_secundario_texto: e.target.value})}
                  placeholder="Ex: Falar com Especialista"
                />
              </div>
              <div>
                <Label>CTA Secundário - Link</Label>
                <Input
                  value={formData.cta_secundario_link}
                  onChange={(e) => setFormData({...formData, cta_secundario_link: e.target.value})}
                  placeholder="Ex: https://wa.me/5511999999999"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Estatísticas (Cards Flutuantes)</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Estatística 1 - Valor</Label>
                  <Input
                    value={formData.estatistica_1_valor}
                    onChange={(e) => setFormData({...formData, estatistica_1_valor: e.target.value})}
                    placeholder="Ex: R$ 35M+"
                  />
                </div>
                <div>
                  <Label>Estatística 1 - Label</Label>
                  <Input
                    value={formData.estatistica_1_label}
                    onChange={(e) => setFormData({...formData, estatistica_1_label: e.target.value})}
                    placeholder="Ex: Renegociados"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Estatística 2 - Valor</Label>
                  <Input
                    value={formData.estatistica_2_valor}
                    onChange={(e) => setFormData({...formData, estatistica_2_valor: e.target.value})}
                    placeholder="Ex: 5.000+"
                  />
                </div>
                <div>
                  <Label>Estatística 2 - Label</Label>
                  <Input
                    value={formData.estatistica_2_label}
                    onChange={(e) => setFormData({...formData, estatistica_2_label: e.target.value})}
                    placeholder="Ex: Clientes"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Estatística 3 - Valor</Label>
                  <Input
                    value={formData.estatistica_3_valor}
                    onChange={(e) => setFormData({...formData, estatistica_3_valor: e.target.value})}
                    placeholder="Ex: 12 anos"
                  />
                </div>
                <div>
                  <Label>Estatística 3 - Label</Label>
                  <Input
                    value={formData.estatistica_3_label}
                    onChange={(e) => setFormData({...formData, estatistica_3_label: e.target.value})}
                    placeholder="Ex: Experiência"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Estatística 4 - Valor</Label>
                  <Input
                    value={formData.estatistica_4_valor}
                    onChange={(e) => setFormData({...formData, estatistica_4_valor: e.target.value})}
                    placeholder="Ex: 12 anos"
                  />
                </div>
                <div>
                  <Label>Estatística 4 - Label</Label>
                  <Input
                    value={formData.estatistica_4_label}
                    onChange={(e) => setFormData({...formData, estatistica_4_label: e.target.value})}
                    placeholder="Ex: Experiência"
                  />
                </div>
              </div>
            </div>
          </div>

          <GatilhoStatsToggles 
            formData={formData} 
            onChange={(key, value) => setFormData({...formData, [key]: value})}
          />

          <GatilhoFormAB 
            formData={formData} 
            onChange={(key, value) => setFormData({...formData, [key]: value})}
          />

          <div>
            <Label>Gatilho Mental</Label>
            <Select value={formData.gatilho_mental} onValueChange={(v) => setFormData({...formData, gatilho_mental: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgencia">Urgência</SelectItem>
                <SelectItem value="autoridade">Autoridade</SelectItem>
                <SelectItem value="prova_social">Prova Social</SelectItem>
                <SelectItem value="escassez">Escassez</SelectItem>
                <SelectItem value="transformacao">Transformação</SelectItem>
                <SelectItem value="reciprocidade">Reciprocidade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Justificativa Legal</Label>
            <Textarea
              value={formData.justificativa_legal || ""}
              onChange={(e) => setFormData({...formData, justificativa_legal: e.target.value})}
              placeholder="Fundamentação legal do gatilho..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
            >
              <Check className="w-4 h-4 mr-2" />
              Aplicar e Propagar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}