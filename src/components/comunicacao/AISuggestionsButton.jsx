import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import AISuggestionsList from './AISuggestionsList';

export default function AISuggestionsButton({ mensagens, onSelectSuggestion }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ultimasMensagens = mensagens
        .filter(m => m.tipo_remetente === 'cliente' || m.tipo_remetente === 'visitante')
        .slice(-3)
        .map(m => m.conteudo)
        .join('\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um assistente de atendimento ao cliente para um escritório de advocacia especializado em defesa do superendividado e direito do consumidor.

Analise as últimas mensagens do cliente abaixo e sugira 3 respostas rápidas, profissionais e empáticas. As respostas devem ser curtas (máximo 2-3 frases) e direcionadas.

MENSAGENS DO CLIENTE:
${ultimasMensagens}

Retorne APENAS as 3 sugestões de resposta, cada uma em uma linha diferente, sem numeração ou formatação adicional.`,
        response_json_schema: {
          type: "object",
          properties: {
            sugestoes: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 3
            }
          }
        }
      });

      setSuggestions(response.sugestoes || []);
      toast.success('Sugestões geradas');
    } catch (error) {
      toast.error('Erro ao gerar sugestões: ' + error.message);
    }
    setLoading(false);
  };

  const handleSelect = (suggestion) => {
    onSelectSuggestion(suggestion);
    setSuggestions([]);
  };

  if (suggestions.length > 0) {
    return (
      <AISuggestionsList
        suggestions={suggestions}
        onSelect={handleSelect}
        onClose={() => setSuggestions([])}
      />
    );
  }

  return (
    <Button
      onClick={handleGenerate}
      disabled={loading || !mensagens || mensagens.length === 0}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
      Sugestões IA
    </Button>
  );
}