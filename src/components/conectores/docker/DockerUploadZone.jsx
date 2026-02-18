import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DockerUploadZone({ escritorioId, onUploadComplete }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!escritorioId) {
      toast.error('Escritório não identificado');
      return;
    }

    setLoading(true);
    try {
      console.log('Fazendo upload do arquivo:', file.name);
      
      const uploadResult = await base44.integrations.Core.UploadFile({ file });
      
      if (!uploadResult?.file_url) {
        throw new Error('Upload falhou - URL não retornada');
      }
      
      console.log('Upload concluído:', uploadResult.file_url);
      
      const tipoMap = {
        'application/pdf': 'PDF',
        'text/plain': 'TXT',
        'application/json': 'JSON',
        'text/html': 'HTML',
        'text/yaml': 'OPENAPI_YAML',
        'application/x-yaml': 'RAML',
        'text/markdown': 'API_BLUEPRINT'
      };

      const analise = await base44.entities.DockerAnalise.create({
        escritorio_id: escritorioId,
        titulo: file.name,
        tipo_fonte: tipoMap[file.type] || 'TXT',
        arquivo_url: uploadResult.file_url,
        status: 'PENDENTE',
        progresso_percentual: 0,
        pode_recomecar: false,
        tentativas: 0,
        ultima_atualizacao: new Date().toISOString()
      });

      console.log('Análise criada:', analise.id, '- Iniciando processamento');

      // Iniciar análise automaticamente em background
      base44.functions.invoke('analisarDocumentosAPI', {
        analise_id: analise.id
      }).then(() => console.log('Análise iniciada'))
        .catch(err => console.error('Erro ao iniciar análise:', err));

      toast.success('✅ Arquivo enviado! Análise iniciada em background...');
      onUploadComplete?.();
    } catch (err) {
      console.error('Erro no upload:', err);
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async () => {
    const urlTrimmed = url.trim();
    if (!urlTrimmed) {
      toast.error('URL é obrigatória');
      return;
    }
    
    if (!escritorioId) {
      toast.error('Escritório não identificado');
      return;
    }

    setLoading(true);
    try {
      console.log('Criando análise para URL:', urlTrimmed);
      
      // Validar formato básico
      try {
        new URL(urlTrimmed);
      } catch {
        throw new Error('URL inválida');
      }
      
      const analise = await base44.entities.DockerAnalise.create({
        escritorio_id: escritorioId,
        titulo: new URL(urlTrimmed).hostname,
        tipo_fonte: urlTrimmed.includes('swagger') ? 'URL_SWAGGER' : 'URL_OPENAPI',
        url_documentacao: urlTrimmed,
        status: 'PENDENTE',
        progresso_percentual: 0,
        pode_recomecar: false,
        tentativas: 0,
        ultima_atualizacao: new Date().toISOString()
      });

      console.log('Análise criada:', analise.id, '- Iniciando processamento');

      // Iniciar análise em background
      base44.functions.invoke('analisarDocumentosAPI', {
        analise_id: analise.id
      }).then(() => console.log('Análise iniciada'))
        .catch(err => console.error('Erro ao iniciar análise:', err));

      setUrl('');
      toast.success('✅ Análise iniciada! Processando em background...');
      onUploadComplete?.();
    } catch (err) {
      console.error('Erro ao criar análise:', err);
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload Documentação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-2">
            Arquivo (PDF, JSON, YAML, RAML, Markdown, HTML)
          </label>
          <Input 
            type="file" 
            onChange={handleFileUpload} 
            disabled={loading} 
            accept=".pdf,.json,.txt,.html,.yaml,.yml,.raml,.md,.markdown"
          />
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            Suporta: Swagger, OpenAPI, RAML, API Blueprint, Postman Collections
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium mb-2">URL Swagger/OpenAPI</label>
          <div className="flex gap-2">
            <Input 
              placeholder="https://api.exemplo.com/docs" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleUrlSubmit} disabled={loading || !url} size="icon">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}