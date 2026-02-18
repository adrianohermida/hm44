import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, Plus, Trash2, ExternalLink, Upload, TrendingUp, FileText } from "lucide-react";
import FonteUploadModal from "@/components/marketing/FonteUploadModal";
import FonteRatingWidget from "@/components/marketing/FonteRatingWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { createPageUrl } from "@/utils";

export default function RepositorioFontes() {
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    url: '',
    tipo: 'jurisprudencia',
    categoria: 'outro',
    tags: [],
    descricao: ''
  });
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: fontes = [] } = useQuery({
    queryKey: ['fontes-repositorio', escritorio?.id],
    queryFn: () => base44.entities.FonteRepositorio.filter(
      { escritorio_id: escritorio.id, ativo: true },
      '-vezes_utilizada'
    ),
    enabled: !!escritorio
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FonteRepositorio.create({
      ...data,
      escritorio_id: escritorio.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['fontes-repositorio']);
      setShowForm(false);
      setFormData({ titulo: '', url: '', tipo: 'jurisprudencia', categoria: 'outro', tags: [], descricao: '' });
      toast.success('Fonte adicionada!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FonteRepositorio.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fontes-repositorio']);
      toast.success('Fonte removida');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo || (!formData.url && !formData.arquivo_url)) {
      toast.error('Preencha título e URL/Arquivo');
      return;
    }
    createMutation.mutate(formData);
  };

  if (user?.role !== 'admin') return <div className="p-8 text-center text-red-600">Acesso restrito</div>;
  if (!escritorio) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Breadcrumb items={[
        { label: 'Marketing', url: createPageUrl('Marketing') },
        { label: 'Repositório de Fontes' }
      ]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Repositório de Fontes</h1>
          <p className="text-gray-600">Gerencie fontes confiáveis para referências no blog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUpload(!showUpload)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Documento
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar URL
          </Button>
        </div>
      </div>

      {showUpload && (
        <div className="mb-6">
          <FonteUploadModal
            escritorioId={escritorio.id}
            onSuccess={() => {
              queryClient.invalidateQueries(['fontes-repositorio']);
              setShowUpload(false);
            }}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}

      {showForm && (
        <Card className="p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Título da fonte"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            />
            <Input
              placeholder="URL (ex: https://stf.jus.br/...)"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            />
            <Input
              placeholder="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select value={formData.tipo} onValueChange={(v) => setFormData(prev => ({ ...prev, tipo: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="legislacao">Legislação</SelectItem>
                  <SelectItem value="jurisprudencia">Jurisprudência</SelectItem>
                  <SelectItem value="doutrina">Doutrina</SelectItem>
                  <SelectItem value="oficial">Órgão Oficial</SelectItem>
                  <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.categoria} onValueChange={(v) => setFormData(prev => ({ ...prev, categoria: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="stf">STF</SelectItem>
                  <SelectItem value="stj">STJ</SelectItem>
                  <SelectItem value="tst">TST</SelectItem>
                  <SelectItem value="tjsp">TJSP</SelectItem>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="estadual">Estadual</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending}>
                Salvar
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {fontes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Nenhuma fonte cadastrada</p>
          </div>
        )}
        {fontes.map((fonte) => (
          <Card key={fonte.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {fonte.arquivo_url && <FileText className="w-4 h-4 text-orange-600" />}
                  <h3 className="font-bold">{fonte.titulo}</h3>
                  <Badge variant="outline">{fonte.tipo}</Badge>
                  <Badge className="bg-blue-600 text-white">{fonte.categoria}</Badge>
                  {fonte.vezes_utilizada > 0 && (
                    <Badge className="bg-green-600 text-white flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {fonte.vezes_utilizada}x
                    </Badge>
                  )}
                </div>
                {fonte.resumo_ia && (
                  <p className="text-xs text-gray-500 mb-1 italic">{fonte.resumo_ia}</p>
                )}
                {fonte.descricao && (
                  <p className="text-sm text-gray-600 mb-2">{fonte.descricao}</p>
                )}
                {fonte.tags_ia?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {fonte.tags_ia.slice(0, 5).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {fonte.url && (
                    <a 
                      href={fonte.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {fonte.arquivo_url ? 'URL adicional' : fonte.url}
                    </a>
                  )}
                  {fonte.arquivo_url && (
                    <a 
                      href={fonte.arquivo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      {fonte.arquivo_nome || 'Documento'}
                    </a>
                  )}
                  <FonteRatingWidget 
                    fonte={fonte}
                    onRatingUpdate={() => queryClient.invalidateQueries(['fontes-repositorio'])}
                  />
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteMutation.mutate(fonte.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}