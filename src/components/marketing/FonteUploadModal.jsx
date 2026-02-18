import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FonteUploadModal({ escritorioId, onSuccess, onCancel }) {
  const [processando, setProcessando] = useState(false);
  const [arquivo, setArquivo] = useState(null);
  const [analiseIA, setAnaliseIA] = useState(null);
  const [form, setForm] = useState({
    titulo: '',
    tipo: 'jurisprudencia',
    categoria: 'outro',
    descricao: ''
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tipos = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!tipos.includes(file.type)) {
      toast.error('Apenas PDF e DOCX são permitidos');
      return;
    }

    setArquivo(file);
    setProcessando(true);

    try {
      // Upload do arquivo
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Análise IA do conteúdo
      const analise = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise este documento jurídico e extraia:

DOCUMENTO: ${file.name}

Retorne:
1. Título sugerido (80 chars max)
2. Tipo (legislacao/jurisprudencia/doutrina/oficial/artigo_cientifico)
3. Categoria (stf/stj/tst/trt/tjsp/tjrj/federal/estadual/trabalhista/portal_juridico/outro)
4. Resumo executivo (200 chars)
5. Tags relevantes (5-8 palavras-chave)
6. Score confiabilidade (0-5) baseado em: fonte oficial, data, citações, formatação
7. Temas jurídicos principais`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            titulo_sugerido: { type: "string" },
            tipo_sugerido: { type: "string" },
            categoria_sugerida: { type: "string" },
            resumo: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            confiabilidade_score: { type: "number" },
            temas: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnaliseIA({ ...analise, arquivo_url: file_url });
      setForm(prev => ({
        ...prev,
        titulo: analise.titulo_sugerido || file.name,
        tipo: analise.tipo_sugerido || prev.tipo,
        categoria: analise.categoria_sugerida || prev.categoria,
        descricao: analise.resumo || ''
      }));

      toast.success('Documento analisado pela IA!');
    } catch (error) {
      toast.error('Erro ao analisar documento');
    } finally {
      setProcessando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!analiseIA) return;

    setProcessando(true);
    try {
      await base44.entities.FonteRepositorio.create({
        escritorio_id: escritorioId,
        titulo: form.titulo,
        tipo: form.tipo,
        categoria: form.categoria,
        descricao: form.descricao,
        arquivo_url: analiseIA.arquivo_url,
        arquivo_nome: arquivo.name,
        arquivo_tipo: arquivo.type,
        tags_ia: analiseIA.tags || [],
        resumo_ia: analiseIA.resumo,
        confiabilidade_score: analiseIA.confiabilidade_score || 4,
        total_avaliacoes: 1
      });

      toast.success('Fonte adicionada com sucesso!');
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar fonte');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload de Documento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!analiseIA ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                disabled={processando}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {processando ? (
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-gray-400" />
                ) : (
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                )}
                <p className="text-sm font-medium">
                  {processando ? 'Analisando com IA...' : 'Clique para selecionar PDF ou DOCX'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Máx 10MB</p>
              </label>
            </div>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-800">Análise IA Concluída</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analiseIA.tags?.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-white rounded text-xs">{tag}</span>
                  ))}
                </div>
              </div>

              <div>
                <Label>Título</Label>
                <Input value={form.titulo} onChange={(e) => setForm(p => ({ ...p, titulo: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm(p => ({ ...p, tipo: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legislacao">Legislação</SelectItem>
                      <SelectItem value="jurisprudencia">Jurisprudência</SelectItem>
                      <SelectItem value="doutrina">Doutrina</SelectItem>
                      <SelectItem value="oficial">Oficial</SelectItem>
                      <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select value={form.categoria} onValueChange={(v) => setForm(p => ({ ...p, categoria: v }))}>
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
              </div>

              <div>
                <Label>Descrição</Label>
                <Textarea value={form.descricao} onChange={(e) => setForm(p => ({ ...p, descricao: e.target.value }))} rows={3} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={processando}>
                  {processando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Salvar Fonte
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}