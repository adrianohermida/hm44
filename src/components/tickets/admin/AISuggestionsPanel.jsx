import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AISuggestionsPanel({ ticketId, onSelectResponse }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const suggestMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('autoTicketResponse', {
        ticket_id: ticketId,
        action: 'suggest_response'
      });
      return response.data;
    },
    onSuccess: (data) => {
      setSuggestions(data.respostas || []);
      toast.success('Sugestões geradas com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao gerar sugestões: ' + error.message);
    }
  });

  const handleCopy = (texto, index) => {
    navigator.clipboard.writeText(texto);
    setSelectedIndex(index);
    setTimeout(() => setSelectedIndex(null), 2000);
    toast.success('Texto copiado');
  };

  const handleUse = (resposta) => {
    onSelectResponse(resposta.conteudo);
    toast.success('Resposta inserida');
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Sugestões de IA
          </CardTitle>
          <Button
            size="sm"
            onClick={() => suggestMutation.mutate()}
            disabled={suggestMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 h-8 px-3"
          >
            {suggestMutation.isPending ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 mr-1" />
                Gerar Sugestões
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {suggestions.length > 0 && (
        <CardContent className="space-y-3 pt-0">
          {suggestions.map((sugestao, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 border border-blue-200 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm text-gray-900">{sugestao.titulo}</h4>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(sugestao.conteudo, idx)}
                    className="h-7 w-7 p-0"
                  >
                    {selectedIndex === idx ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{sugestao.conteudo}</p>
              <Button
                size="sm"
                onClick={() => handleUse(sugestao)}
                className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs"
              >
                Usar esta resposta
              </Button>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}