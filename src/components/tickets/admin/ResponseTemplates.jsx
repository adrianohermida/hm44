import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TEMPLATE_TYPES = [
  { value: 'boas_vindas', label: 'Boas-vindas' },
  { value: 'aguardando_documentos', label: 'Aguardando Documentos' },
  { value: 'atualizacao_processo', label: 'Atualização de Processo' },
  { value: 'agendamento_consulta', label: 'Agendamento de Consulta' },
  { value: 'fechamento', label: 'Encerramento' }
];

export default function ResponseTemplates({ onSelectTemplate }) {
  const [selectedType, setSelectedType] = useState('');
  const [generatedTemplate, setGeneratedTemplate] = useState(null);

  const generateMutation = useMutation({
    mutationFn: async (tipo) => {
      const response = await base44.functions.invoke('autoTicketResponse', {
        action: 'generate_template',
        tipo
      });
      return response.data;
    },
    onSuccess: (data) => {
      setGeneratedTemplate(data);
      toast.success('Template gerado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao gerar template: ' + error.message);
    }
  });

  const handleGenerate = () => {
    if (!selectedType) {
      toast.error('Selecione um tipo de template');
      return;
    }
    generateMutation.mutate(selectedType);
  };

  const handleUse = () => {
    if (generatedTemplate) {
      onSelectTemplate(generatedTemplate.corpo);
      toast.success('Template inserido');
    }
  };

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-green-600" />
          Templates de Resposta
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="flex-1 bg-white">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={handleGenerate}
            disabled={!selectedType || generateMutation.isPending}
            className="bg-green-600 hover:bg-green-700 flex-shrink-0"
            size="sm"
          >
            {generateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Gerar'
            )}
          </Button>
        </div>

        {generatedTemplate && (
          <div className="bg-white rounded-lg p-3 border border-green-200 space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">{generatedTemplate.assunto}</h4>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
              {generatedTemplate.corpo}
            </p>
            <Button
              size="sm"
              onClick={handleUse}
              className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs"
            >
              Usar este template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}