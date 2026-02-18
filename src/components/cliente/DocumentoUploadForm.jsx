import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function DocumentoUploadForm({ user, escritorioId, onSuccess }) {
  const [tipo, setTipo] = useState("outro");
  const [descricao, setDescricao] = useState("");
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      return await base44.entities.Documento.create({
        titulo: file.name,
        tipo,
        descricao,
        arquivo_url: file_url,
        tamanho_bytes: file.size,
        formato: file.name.split('.').pop(),
        escritorio_id: escritorioId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['meus-documentos']);
      queryClient.invalidateQueries(['meus-documentos-painel']);
      toast.success('Documento enviado com sucesso!');
      setTipo("outro");
      setDescricao("");
      setFile(null);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Erro ao enviar documento: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Selecione um arquivo');
      return;
    }
    uploadMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Tipo de Documento *</Label>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="peticao">Petição</SelectItem>
            <SelectItem value="contrato">Contrato</SelectItem>
            <SelectItem value="procuracao">Procuração</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva o documento..."
          rows={3}
        />
      </div>

      <div>
        <Label>Arquivo *</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0])}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          {file && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setFile(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
        {uploadMutation.isPending ? 'Enviando...' : 'Enviar Documento'}
      </Button>
    </form>
  );
}