import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Save, RefreshCw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ContentGeneratorPreview({ content, config, onSave, onRegenerate, loading }) {
  const [editedContent, setEditedContent] = useState(content.texto);
  const [agendamento, setAgendamento] = useState('');

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Preview:</h3>
        <div className="prose prose-sm max-w-none bg-white p-4 rounded border">
          <ReactMarkdown>{editedContent}</ReactMarkdown>
        </div>
      </div>

      <div>
        <Label>Editar Conteúdo</Label>
        <Textarea 
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      {config.tipo === 'blog' && (
        <div>
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Agendar Publicação (opcional)
          </Label>
          <Input 
            type="datetime-local"
            value={agendamento}
            onChange={(e) => setAgendamento(e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={onRegenerate} variant="outline" className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Regerar
        </Button>
        <Button onClick={() => onSave({ ...content, texto: editedContent, agendamento })} disabled={loading} className="flex-1">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </div>
    </div>
  );
}