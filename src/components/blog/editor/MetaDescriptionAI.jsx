import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function MetaDescriptionAI({ titulo, resumo, topicos, metaAtual, onAplicar }) {
  const [gerando, setGerando] = useState(false);

  const gerarMeta = async () => {
    if (!titulo) {
      toast.error('Digite um título primeiro');
      return;
    }

    setGerando(true);
    try {
      const conteudoTopicos = topicos.map(t => t.texto || t.itens?.join(' ') || '').join(' ').substring(0, 800);
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise o contexto e gere uma meta description OTIMIZADA:

TÍTULO: ${titulo}
RESUMO: ${resumo || 'não fornecido'}
CONTEÚDO: ${conteudoTopicos}

ANÁLISE REQUERIDA:
1. Identifique a palavra-chave PRINCIPAL e secundárias
2. Determine a INTENÇÃO de busca (informacional/transacional/navegacional)
3. Identifique o PÚBLICO-ALVO específico
4. Detecte BENEFÍCIOS únicos a destacar

REGRAS OBRIGATÓRIAS:
✓ EXATAMENTE 150-160 caracteres (nem mais, nem menos)
✓ Comece com palavra-chave principal em NEGRITO mental
✓ Inclua BENEFÍCIO tangível (economia, rapidez, facilidade)
✓ CTA emocional (Proteja-se, Recupere, Garanta, Descubra)
✓ Use números quando relevante (Ex: "3 passos", "até 70%")
✓ Linguagem direta e persuasiva (você, seu, sua)

FORMATO IDEAL:
[Keyword]. [Benefício específico + dado]. [CTA emocional]!

EXEMPLOS:
"Superendividamento: renegocie até 90% das dívidas em 3 passos. Recupere sua liberdade financeira hoje!"
"Direitos do Consumidor: conheça 7 proteções contra bancos. Defenda-se agora com segurança jurídica!"

Retorne APENAS a meta description final, SEM aspas ou explicações.`,
        add_context_from_internet: false
      });

      const meta = resultado.trim().substring(0, 160);
      onAplicar(meta);
      toast.success('Meta description otimizada gerada!');
    } catch (error) {
      console.error('Erro ao gerar meta:', error);
      toast.error('Erro ao gerar meta description');
    } finally {
      setGerando(false);
    }
  };

  const caracteres = metaAtual?.length || 0;
  const cor = caracteres >= 150 && caracteres <= 160 ? 'text-green-600' : caracteres > 160 ? 'text-red-600' : 'text-yellow-600';

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <Label>Meta Description</Label>
        <Button size="sm" variant="outline" onClick={gerarMeta} disabled={gerando || !titulo}>
          <Sparkles className={`w-3 h-3 mr-1 ${gerando ? 'animate-pulse' : ''}`} />
          {gerando ? 'Gerando...' : 'Gerar com IA'}
        </Button>
      </div>
      <Textarea
        value={metaAtual}
        onChange={(e) => onAplicar(e.target.value)}
        placeholder="Descrição que aparece nos resultados de busca (150-160 caracteres)"
        rows={3}
      />
      <p className={`text-xs mt-1 ${cor}`}>
        {caracteres}/160 caracteres {caracteres >= 150 && caracteres <= 160 ? '✓ Ideal' : ''}
      </p>
    </Card>
  );
}