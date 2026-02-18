import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import MarkdownEditor from './editor/MarkdownEditor';
import SEOSuggestions from './editor/SEOSuggestions';
import MediaUploader from './editor/MediaUploader';
import ABTestConfig from './abtesting/ABTestConfig';
import VersionHistory from './versioning/VersionHistory';
import MetaTagsGenerator from './editor/MetaTagsGenerator';
import OtimizadorConteudoAvancado from '@/components/marketing/OtimizadorConteudoAvancado';

export default function ContentFormModal({ open, onClose, onSave, item = null }) {
  const [formData, setFormData] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    categoria: 'direito_consumidor',
    autor: 'Dr. Adriano Hermida Maia',
    status: 'rascunho',
    publicado: false,
    imagem_capa: '',
    tags: [],
    meta_description: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        titulo: item.titulo || '',
        resumo: item.resumo || '',
        conteudo: item.conteudo || '',
        categoria: item.categoria || 'direito_consumidor',
        autor: item.autor || 'Dr. Adriano Hermida Maia',
        status: item.status || 'rascunho',
        publicado: item.publicado || false,
        imagem_capa: item.imagem_capa || '',
        tags: item.tags || [],
        meta_description: item.meta_description || ''
      });
    } else {
      setFormData({
        titulo: '',
        resumo: '',
        conteudo: '',
        categoria: 'direito_consumidor',
        autor: 'Dr. Adriano Hermida Maia',
        status: 'rascunho',
        publicado: false,
        imagem_capa: '',
        tags: [],
        meta_description: ''
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Editar' : 'Novo'} Artigo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <Input
                placeholder="Título"
                value={formData.titulo || ''}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
              <Textarea
                placeholder="Resumo (150-160 caracteres)"
                value={formData.resumo || ''}
                onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
                rows={3}
              />
              
              <MarkdownEditor
                value={formData.conteudo || ''}
                onChange={(v) => setFormData({ ...formData, conteudo: v })}
              />
              <div className="flex gap-2 items-end">
                <Input
                  placeholder="URL Imagem Capa"
                  value={formData.imagem_capa || ''}
                  onChange={(e) => setFormData({ ...formData, imagem_capa: e.target.value })}
                  className="flex-1"
                />
                <MediaUploader onUpload={(url) => setFormData({ ...formData, imagem_capa: url })} />
              </div>

              <Textarea
                placeholder="Meta Description (SEO)"
                value={formData.meta_description || ''}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <SEOSuggestions
                titulo={formData.titulo}
                resumo={formData.resumo}
                conteudo={formData.conteudo}
                metaDescription={formData.meta_description}
              />

              <div>
                <Label>Categoria</Label>
                <Select value={formData.categoria} onValueChange={(v) => setFormData({ ...formData, categoria: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direito_consumidor">Direito do Consumidor</SelectItem>
                    <SelectItem value="superendividamento">Superendividamento</SelectItem>
                    <SelectItem value="negociacao_dividas">Negociação de Dívidas</SelectItem>
                    <SelectItem value="direito_bancario">Direito Bancário</SelectItem>
                    <SelectItem value="educacao_financeira">Educação Financeira</SelectItem>
                    <SelectItem value="casos_sucesso">Casos de Sucesso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Autor</Label>
                <Input
                  value={formData.autor || ''}
                  onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={formData.status || 'rascunho'} 
                  onValueChange={(v) => setFormData({...formData, status: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="revisao">Em Revisão</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <Switch
                  checked={formData.publicado || false}
                  onCheckedChange={(checked) => setFormData({...formData, publicado: checked})}
                />
                <Label className="text-sm">Visível no site</Label>
              </div>

              <ABTestConfig formData={formData} setFormData={setFormData} />

              {item?.id && <VersionHistory artigoId={item.id} />}
            </div>
          </div>

          {item?.id && (
            <div className="border-t pt-4">
              <OtimizadorConteudoAvancado artigo={item} />
            </div>
          )}

          <div className="flex gap-2 justify-end border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar Artigo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}