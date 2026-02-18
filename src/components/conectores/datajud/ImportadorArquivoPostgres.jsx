import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function ImportadorArquivoPostgres() {
  const [arquivo, setArquivo] = useState(null);
  const [tipoTabela, setTipoTabela] = useState('movimentos');
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [resultado, setResultado] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Arquivo muito grande (máx 100MB)');
      return;
    }

    setArquivo(file);
    setResultado(null);
  };

  const handleImport = async () => {
    if (!arquivo) {
      toast.error('Selecione um arquivo');
      return;
    }

    setProcessando(true);
    setProgresso(10);

    try {
      // 1. Upload do arquivo para nuvem
      toast.info('Enviando arquivo para nuvem...');
      const uploadResult = await base44.integrations.Core.UploadFile({ file: arquivo });
      
      if (!uploadResult?.file_url) {
        throw new Error('Falha ao enviar arquivo');
      }

      setProgresso(30);
      toast.info('Processando arquivo...');

      // 2. Processar arquivo da nuvem
      const response = await base44.functions.invoke('processarArquivoPostgresTPU', {
        file_url: uploadResult.file_url,
        tipo_tabela: tipoTabela,
        nome_arquivo: arquivo.name
      });

      setProgresso(100);

      if (response.data.success) {
        setResultado({
          success: true,
          inseridos: response.data.inseridos,
          atualizados: response.data.atualizados,
          erros: response.data.erros || 0
        });
        toast.success(`Importação concluída: ${response.data.inseridos} registros`);
      } else {
        setResultado({ success: false, erro: response.data.erro });
        toast.error(response.data.erro || 'Erro ao importar');
      }
    } catch (error) {
      toast.error(error.message);
      setResultado({ success: false, erro: error.message });
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Importar Arquivo PostgreSQL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 space-y-1">
          <p><strong>📌 Formato aceito:</strong> Arquivos .sql ou .dump do PostgreSQL (até 100MB)</p>
          <p>• Suporta INSERTs multi-line</p>
          <p>• Suporta strings com aspas e vírgulas</p>
          <p>• Ignora comentários (-- e /* */)</p>
        </div>

        <div>
          <Label>Tipo de Tabela</Label>
          <Select value={tipoTabela} onValueChange={setTipoTabela}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movimentos">Movimentos</SelectItem>
              <SelectItem value="classes">Classes</SelectItem>
              <SelectItem value="assuntos">Assuntos</SelectItem>
              <SelectItem value="documentos">Documentos Públicos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Arquivo PostgreSQL</Label>
          <Input
            type="file"
            accept=".sql,.dump,.txt"
            onChange={handleFileChange}
            disabled={processando}
          />
          {arquivo && (
            <p className="text-xs text-gray-500 mt-1">
              {arquivo.name} ({(arquivo.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {processando && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processando arquivo...
            </div>
            <Progress value={progresso} />
          </div>
        )}

        {resultado && (
          <div className={`p-3 rounded border ${
            resultado.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              {resultado.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="text-sm">
                {resultado.success ? (
                  <>
                    <p className="font-semibold text-green-900">Importação concluída</p>
                    <p className="text-green-700">
                      {resultado.inseridos} inseridos, {resultado.atualizados} atualizados
                    </p>
                    {resultado.erros > 0 && (
                      <p className="text-yellow-600">{resultado.erros} erros</p>
                    )}
                  </>
                ) : (
                 <>
                   <p className="font-semibold text-red-900">Erro</p>
                   <p className="text-red-700">{resultado.erro}</p>
                   {resultado.debug && (
                     <details className="mt-2 text-xs">
                       <summary className="cursor-pointer text-red-600">Debug Info</summary>
                       <pre className="mt-1 text-red-600 whitespace-pre-wrap">
                         {JSON.stringify(resultado.debug, null, 2)}
                       </pre>
                     </details>
                   )}
                 </>
                )}
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleImport}
          disabled={!arquivo || processando}
          className="w-full"
        >
          {processando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Importar Arquivo
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}