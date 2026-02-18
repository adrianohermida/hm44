import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Link as LinkIcon, Upload, X, ExternalLink, Database } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import RepositorioFontesModal from "./RepositorioFontesModal";

export default function ReferenciasPanel({ referencias = [], onChange }) {
  const [novaUrl, setNovaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [modalRepositorio, setModalRepositorio] = useState(false);

  const adicionarUrl = () => {
    if (!novaUrl) return;
    onChange([...(referencias || []), { tipo: 'url', valor: novaUrl, id: Date.now() }]);
    setNovaUrl('');
    toast.success('URL adicionada');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange([...(referencias || []), { tipo: 'arquivo', valor: file_url, nome: file.name, id: Date.now() }]);
      toast.success('Arquivo anexado');
    } catch (error) {
      toast.error('Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const remover = (id) => {
    onChange((referencias || []).filter(r => r.id !== id));
  };

  const adicionarFontesRepositorio = (fontes) => {
    const novasRefs = fontes.map(f => ({
      tipo: 'url',
      valor: f.url_base,
      nome: f.nome,
      fonte_confiavel_id: f.id,
      id: `fonte-${Date.now()}-${Math.random()}`
    }));
    onChange([...(referencias || []), ...novasRefs]);
    toast.success(`${fontes.length} fonte(s) adicionada(s)`);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold">Referências</h3>
        </div>

        <div className="space-y-3">
          <div>
            <Label>URL de Referência</Label>
            <div className="flex gap-2">
              <Input
                value={novaUrl}
                onChange={(e) => setNovaUrl(e.target.value)}
                placeholder="https://..."
                onKeyPress={(e) => e.key === 'Enter' && adicionarUrl()}
              />
              <Button onClick={adicionarUrl} size="icon">
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setModalRepositorio(true)}
            >
              <Database className="w-4 h-4 mr-2" />
              Repositório
            </Button>
            <label className="flex-1">
              <Button variant="outline" className="w-full" disabled={uploading} asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Enviando...' : 'Anexar'}
                </span>
              </Button>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {referencias && referencias.length > 0 && (
            <div className="space-y-2">
              {referencias.map(ref => (
                <div key={ref.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {ref.tipo === 'url' ? (
                      <>
                        <LinkIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <a href={ref.valor} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-blue-600 hover:underline truncate">
                          {ref.nome || ref.valor}
                        </a>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm truncate">{ref.nome}</span>
                      </>
                    )}
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remover(ref.id)}>
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500">
          A IA usará estas referências para escrever com autoridade e validar informações
        </p>
      </div>

      <RepositorioFontesModal
        open={modalRepositorio}
        onClose={() => setModalRepositorio(false)}
        onSelecionar={adicionarFontesRepositorio}
      />
    </Card>
  );
}