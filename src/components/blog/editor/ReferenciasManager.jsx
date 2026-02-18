import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Link, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function ReferenciasManager({ referencias = [], onChange }) {
  const [novaUrl, setNovaUrl] = useState('');
  const [importando, setImportando] = useState(false);

  const adicionarUrl = () => {
    if (!novaUrl.trim()) return;
    onChange([...referencias, { url: novaUrl, tipo: 'url' }]);
    setNovaUrl('');
    toast.success('URL adicionada');
  };

  const importarArquivo = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setImportando(true);
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        onChange([...referencias, { url: file_url, tipo: 'arquivo', nome: file.name }]);
        toast.success('Arquivo importado');
      } catch (error) {
        console.error('Erro ao importar:', error);
        toast.error('Erro ao importar arquivo');
      } finally {
        setImportando(false);
      }
    };
    input.click();
  };

  const remover = (index) => {
    onChange(referencias.filter((_, i) => i !== index));
    toast.success('Referência removida');
  };

  return (
    <Card className="p-4">
      <Label className="mb-3 block">Referências e Fontes</Label>
      
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <Input
            value={novaUrl}
            onChange={(e) => setNovaUrl(e.target.value)}
            placeholder="Cole uma URL..."
            onKeyPress={(e) => e.key === 'Enter' && adicionarUrl()}
          />
          <Button size="sm" onClick={adicionarUrl}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={importarArquivo}
          disabled={importando}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {importando ? 'Importando...' : 'Importar Arquivo (PDF, DOC, TXT)'}
        </Button>
      </div>

      <div className="space-y-2">
        {referencias.map((ref, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
            <Link className="w-4 h-4 text-gray-500" />
            <span className="flex-1 truncate">
              {ref.nome || ref.url}
            </span>
            <Button size="icon" variant="ghost" onClick={() => remover(i)}>
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>
          </div>
        ))}
        {referencias.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhuma referência adicionada
          </p>
        )}
      </div>
    </Card>
  );
}