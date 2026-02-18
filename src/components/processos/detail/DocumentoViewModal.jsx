import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DocumentoViewModal({ documento, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  if (!documento) return null;

  const handleDownload = async () => {
    if (downloading) return;

    setDownloading(true);
    setError(null);

    try {
      if (documento.isPublico) {
        // Documento Escavador - usar função backend
        const { data } = await base44.functions.invoke('downloadDocumentoPublico', {
          documento_publico_id: documento.id
        });

        if (data.url) {
          window.open(data.url, '_blank');
          toast.success('Download iniciado');
        } else {
          throw new Error('URL de download não disponível');
        }
      } else {
        // Documento anexado - download direto
        if (documento.arquivo_url) {
          window.open(documento.arquivo_url, '_blank');
          toast.success('Download iniciado');
        } else {
          throw new Error('Arquivo não disponível');
        }
      }
    } catch (err) {
      console.error('Erro download:', err);
      setError(err.message || 'Erro ao baixar documento');
      toast.error('Erro ao baixar documento');
    } finally {
      setDownloading(false);
    }
  };

  const handleViewInBrowser = () => {
    if (documento.isPublico && documento.url_api) {
      window.open(documento.url_api, '_blank');
    } else if (documento.arquivo_url) {
      window.open(documento.arquivo_url, '_blank');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {documento?.titulo || documento?.nome || 'Documento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {documento?.descricao && (
            <p className="text-sm text-[var(--text-secondary)]">
              {documento.descricao}
            </p>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {documento?.isPublico ? 'Documento Público (Escavador)' : 'Documento Anexado'}
              </p>
              {documento?.quantidade_paginas && (
                <p className="text-xs text-[var(--text-tertiary)]">
                  {documento.quantidade_paginas} páginas
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {(documento?.url_api || documento?.arquivo_url) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewInBrowser}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir no navegador
                </Button>
              )}
              <Button
                onClick={handleDownload}
                disabled={downloading}
                size="sm"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {downloading ? 'Baixando...' : 'Baixar'}
              </Button>
            </div>
          </div>

          {documento?.isPublico && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Documentos públicos são fornecidos pelo Escavador. 
                O download será iniciado diretamente da plataforma Escavador.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}