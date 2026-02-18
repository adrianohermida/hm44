import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, File, X, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function ImportarPorArquivo({ onImportar, onClose }) {
  const [arquivos, setArquivos] = useState([]);
  const [processando, setProcessando] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setArquivos(files);
  };

  const removerArquivo = (index) => {
    setArquivos(prev => prev.filter((_, i) => i !== index));
  };

  const extrairConteudo = async () => {
    if (arquivos.length === 0) {
      toast.error('Selecione pelo menos um arquivo');
      return;
    }

    setProcessando(true);
    try {
      // Upload de todos os arquivos
      const uploads = await Promise.all(
        arquivos.map(async (file) => {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          return file_url;
        })
      );

      // Processar primeiro arquivo (ou combinar múltiplos no futuro)
      const response = await base44.functions.invoke('importarArtigoExterno', { 
        file_url: uploads[0] 
      });
      
      if (response.data.success) {
        setPreview(response.data.dados);
        toast.success('Conteúdo extraído!');
      } else {
        toast.error(response.data.error || 'Erro ao extrair');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar arquivo');
    } finally {
      setProcessando(false);
    }
  };

  const confirmarImportacao = () => {
    if (!preview) return;
    
    onImportar({
      titulo: preview.titulo,
      resumo: preview.resumo || '',
      conteudo_markdown: preview.conteudo_markdown,
      keywords: preview.keywords || [],
      autor: preview.autor || ''
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Selecionar Arquivo(s)</Label>
        <div className="mt-2">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Clique para selecionar ou arraste arquivos
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOCX, DOC (até 10MB cada)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={handleFileSelect}
              disabled={processando}
            />
          </label>
        </div>
      </div>

      {arquivos.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-bold">
            {arquivos.length} arquivo(s) selecionado(s)
          </Label>
          {arquivos.map((file, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
              <File className="w-4 h-4 text-gray-600" />
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removerArquivo(i)}
                disabled={processando}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button 
            onClick={extrairConteudo}
            disabled={processando}
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
                Extrair Conteúdo
              </>
            )}
          </Button>
        </div>
      )}

      {processando && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-blue-900">Extraindo conteúdo do arquivo...</p>
          <p className="text-xs text-blue-700 mt-1">Isso pode levar alguns segundos</p>
        </div>
      )}

      {preview && !processando && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-700 mb-1">Título</p>
            <p className="text-sm font-medium">{preview.titulo}</p>
          </div>
          
          {preview.resumo && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">Resumo</p>
              <p className="text-sm text-gray-600">{preview.resumo}</p>
            </div>
          )}

          {preview.keywords?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">Palavras-chave</p>
              <div className="flex flex-wrap gap-1">
                {preview.keywords.map((kw, i) => (
                  <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-900">
              Revise o conteúdo importado antes de publicar. Formatações complexas podem precisar de ajustes.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={confirmarImportacao} className="flex-1">
              Importar Artigo
            </Button>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}