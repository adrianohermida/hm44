import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, Loader2, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ValidadorURLModal from './ValidadorURLModal';

export default function DockerURLInput({ escritorioId, onAnaliseCreated }) {
  const [url, setUrl] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipoFonte, setTipoFonte] = useState('URL_SWAGGER');
  const [loading, setLoading] = useState(false);
  const [showValidador, setShowValidador] = useState(false);

  const handleUrlValidada = async (urlData) => {
    if (!escritorioId) {
      toast.error('Escritório não identificado');
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando análise via URL:', urlData);
      
      const result = await base44.functions.invoke('extrairDocViaURL', {
        url: urlData.url,
        titulo: titulo || new URL(urlData.url).hostname,
        tipo_fonte: urlData.tipo_fonte || 'URL_CUSTOM'
      });

      console.log('Resposta extrairDocViaURL:', result);

      if (result.data?.error) {
        throw new Error(result.data.error);
      }

      if (!result.data?.analise_id) {
        throw new Error('Análise não foi criada corretamente');
      }

      toast.success('✅ Análise iniciada! Processando em background...');
      onAnaliseCreated?.(result.data.analise_id);
      setUrl('');
      setTitulo('');
      setShowValidador(false);
    } catch (error) {
      console.error('Erro ao iniciar análise:', error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Extrair de URL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-secondary)]">
            Cole a URL e validaremos antes de iniciar a análise
          </p>
          
          <div>
            <label className="text-sm font-medium mb-2 block">URL da Documentação</label>
            <Input
              type="url"
              placeholder="https://api.exemplo.com/docs"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && url && setShowValidador(true)}
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Suporta: Swagger, OpenAPI, RAML, API Blueprint, Postman
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Título (opcional)</label>
            <Input
              placeholder="Nome da análise"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={() => setShowValidador(true)} 
            disabled={loading || !url}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Validar e Analisar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    
    {showValidador && (
      <ValidadorURLModal 
        url={url}
        open={showValidador}
        onClose={() => setShowValidador(false)}
        onUrlValidada={handleUrlValidada}
      />
    )}
    </>
  );
}