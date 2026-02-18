import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import PublicacoesUploadZone from './import/PublicacoesUploadZone';
import PublicacoesConfigPanel from './import/PublicacoesConfigPanel';
import PublicacoesResultCard from './import/PublicacoesResultCard';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImportadorPublicacoes() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [calcularPrazos, setCalcularPrazos] = useState(true);
  const [usarIA, setUsarIA] = useState(true);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('Arquivo muito grande. Máximo: 10MB');
      return;
    }
    
    if (selectedFile.name.endsWith('.csv') || selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      toast.error('Selecione um arquivo CSV válido');
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    if (!escritorio?.id) {
      toast.error('Escritório não encontrado');
      return;
    }

    setLoading(true);
    setProgress(0);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim()).length - 1;
      
      if (lines === 0) {
        toast.error('Arquivo vazio');
        setLoading(false);
        return;
      }

      let processados = 0;
      const progressInterval = setInterval(() => {
        processados += Math.floor(lines / 20);
        setProgress(Math.min((processados / lines) * 90, 90));
      }, 500);
      
      const response = await base44.functions.invoke('importarPublicacoes', {
        csv_content: text,
        escritorio_id: escritorio.id,
        calcular_prazos: calcularPrazos,
        usar_ia: usarIA,
        enriquecer_cnj: true
      });

      clearInterval(progressInterval);
      setProgress(100);
      setResult(response.data);
      
      if (response.data.importadas > 0) {
        toast.success(`${response.data.importadas} publicações importadas!`);
      } else {
        toast.warning('Nenhuma publicação importada. Verifique o formato.');
      }
    } catch (error) {
      console.error('Erro ao importar:', error);
      toast.error(error.message || 'Erro ao importar publicações');
      setResult({ importadas: 0, erros: [{ linha: 0, erro: error.message }] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importar Publicações</CardTitle>
          <CardDescription>
            Importe publicações de processos via arquivo CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PublicacoesUploadZone 
            file={file} 
            onFileChange={handleFileChange} 
          />

          {file && (
            <PublicacoesConfigPanel
              calcularPrazos={calcularPrazos}
              onCalcularPrazosChange={setCalcularPrazos}
              usarIA={usarIA}
              onUsarIAChange={setUsarIA}
            />
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Formato esperado:</h4>
            <p className="text-xs text-gray-600 mb-2">
              DIÁRIO, PROCESSO, PUBLICAÇÃO EM, COMARCA, VARA, DISPONIBILIZAÇÃO EM, 
              PALAVRA CHAVE, CADERNO, CONTRATANTE, USUÁRIO, EDIÇÃO, PÁGINA INICIAL, 
              PÁGINA FINAL, DESPACHO, CONTEUDO
            </p>
            <p className="text-xs text-gray-500">
              Separador: vírgula (,) ou ponto e vírgula (;)
            </p>
          </div>

          <Button
            onClick={handleImport}
            disabled={!file || loading || !escritorio}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importando... {progress}%
              </>
            ) : !escritorio ? (
              'Carregando escritório...'
            ) : (
              'Importar Publicações'
            )}
          </Button>

          {loading && progress > 0 && (
            <Progress value={progress} className="w-full" />
          )}

          <PublicacoesResultCard result={result} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ℹ️ Informações importantes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-gray-600">
          <p>• Processos inexistentes serão criados automaticamente</p>
          <p>• Partes são extraídas do conteúdo da publicação</p>
          <p>• Tribunal é identificado pelo número CNJ</p>
          <p>• Prazos processuais são calculados automaticamente</p>
          <p>• Use filtros de publicação no módulo Processos</p>
        </CardContent>
      </Card>
    </div>
  );
}