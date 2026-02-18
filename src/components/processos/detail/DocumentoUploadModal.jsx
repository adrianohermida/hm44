import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DocumentoUploadModal({ open, onClose, onSuccess, processoId, escritorioId }) {
  const [file, setFile] = React.useState(null);
  const [tipo, setTipo] = React.useState('outro');
  const [descricao, setDescricao] = React.useState('');
  const [uploading, setUploading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.DocumentoAnexado.create({
        escritorio_id: escritorioId,
        processo_id: processoId,
        nome_arquivo: file.name,
        url_arquivo: file_url,
        tipo_documento: tipo,
        descricao,
        tamanho_bytes: file.size,
        mime_type: file.type
      });
      toast.success('Documento anexado');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao anexar documento');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Anexar Documento</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Arquivo</Label>
            <Input type="file" onChange={e => setFile(e.target.files[0])} required />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="peticao">Petição</SelectItem>
                <SelectItem value="contestacao">Contestação</SelectItem>
                <SelectItem value="recurso">Recurso</SelectItem>
                <SelectItem value="contrato">Contrato</SelectItem>
                <SelectItem value="procuracao">Procuração</SelectItem>
                <SelectItem value="documento_pessoal">Doc. Pessoal</SelectItem>
                <SelectItem value="certidao">Certidão</SelectItem>
                <SelectItem value="comprovante">Comprovante</SelectItem>
                <SelectItem value="laudo">Laudo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Descrição</Label>
            <Input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Opcional" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>Cancelar</Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}