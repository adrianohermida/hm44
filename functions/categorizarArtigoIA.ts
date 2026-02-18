import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { titulo, conteudo, resumo } = await req.json();

    if (!titulo && !conteudo) {
      return Response.json({ error: 'Título ou conteúdo obrigatório' }, { status: 400 });
    }

    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Analise o seguinte artigo jurídico e determine a categoria mais apropriada:

Título: ${titulo}
Resumo: ${resumo || 'N/A'}
Conteúdo: ${conteudo?.substring(0, 1000) || 'N/A'}

Categorias disponíveis:
- direito_consumidor: Direitos básicos do consumidor, CDC, relações de consumo
- superendividamento: Endividamento excessivo, insolvência civil, plano de pagamento
- negociacao_dividas: Acordos, renegociação, quitação de dívidas
- direito_bancario: Contratos bancários, taxas abusivas, relações com bancos
- educacao_financeira: Organização financeira, educação sobre finanças
- casos_sucesso: Casos práticos, histórias de sucesso, resultados obtidos

Retorne JSON:
{
  "categoria": "categoria_escolhida",
  "confianca": 0-100,
  "justificativa": "explicação breve",
  "keywords_sugeridas": ["palavra1", "palavra2", "palavra3"]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          categoria: { type: "string" },
          confianca: { type: "number" },
          justificativa: { type: "string" },
          keywords_sugeridas: { type: "array", items: { type: "string" } }
        }
      }
    });

    return Response.json(resultado);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});