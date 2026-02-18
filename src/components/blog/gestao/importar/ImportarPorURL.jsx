import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Link2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function ImportarPorURL({ onImportar, onClose }) {
  const [url, setUrl] = useState("");
  const [processando, setProcessando] = useState(false);
  const [preview, setPreview] = useState(null);

  const extrairConteudo = async () => {
    if (!url) {
      toast.error('Digite uma URL');
      return;
    }

    setProcessando(true);
    try {
      const response = await base44.functions.invoke('importarArtigoExterno', { url });
      
      if (response.data.success) {
        setPreview(response.data.dados);
        toast.success('Conteúdo extraído!');
      } else {
        toast.error(response.data.error || 'Erro ao extrair');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar URL');
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
      imagens_urls: preview.imagens_urls || [],
      meta_description: preview.meta_description || '',
      keywords: preview.keywords || [],
      autor: preview.autor || '',
      data_publicacao_original: preview.data_publicacao || null
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>URL do Artigo</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="url"
            placeholder="https://exemplo.com/artigo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={processando}
          />
          <Button 
            onClick={extrairConteudo}
            disabled={processando || !url}
          >
            {processando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {processando && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-blue-900">Extraindo conteúdo da página...</p>
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

          {preview.autor && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">Autor</p>
              <p className="text-sm">{preview.autor}</p>
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

          {preview.imagens_urls?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">
                {preview.imagens_urls.length} imagem(ns) encontrada(s)
              </p>
              <div className="flex gap-2 overflow-x-auto">
                {preview.imagens_urls.slice(0, 3).map((url, i) => (
                  <img 
                    key={i}
                    src={url} 
                    alt={`Preview ${i}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-900">
              Revise o conteúdo importado antes de publicar. Imagens externas serão referenciadas por URL.
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