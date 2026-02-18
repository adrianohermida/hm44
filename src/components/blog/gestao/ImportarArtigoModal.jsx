import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Link, Upload, Loader2 } from 'lucide-react';

export default function ImportarArtigoModal({ open, onClose, onSuccess }) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImportUrl = async () => {
    if (!url) {
      toast.error('Digite uma URL');
      return;
    }

    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('importarArtigoExterno', { url });
      toast.success('Artigo importado com sucesso!');
      onSuccess?.(data);
    } catch (error) {
      toast.error(error.message || 'Erro ao importar artigo');
    } finally {
      setLoading(false);
    }
  };

  const handleImportFile = async () => {
    if (!file) {
      toast.error('Selecione um arquivo');
      return;
    }

    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const { data } = await base44.functions.invoke('importarArtigoExterno', { 
        fileUrl: file_url 
      });
      toast.success('Artigo importado com sucesso!');
      onSuccess?.(data);
    } catch (error) {
      toast.error(error.message || 'Erro ao importar arquivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Artigo Externo</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Por URL</TabsTrigger>
            <TabsTrigger value="file">Por Arquivo</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label>URL do Artigo</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.jusbrasil.com.br/artigos/..."
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                Suporta: JusBrasil, Conjur, Migalhas, sites jurídicos em geral
              </p>
            </div>
            <Button 
              onClick={handleImportUrl} 
              disabled={loading || !url}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando e importando...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Importar da URL
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div>
              <Label>Arquivo HTML/PDF</Label>
              <Input
                type="file"
                accept=".html,.pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                Formatos: HTML, PDF, DOCX
              </p>
            </div>
            <Button 
              onClick={handleImportFile} 
              disabled={loading || !file}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando arquivo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Arquivo
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}