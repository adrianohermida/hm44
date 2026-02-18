import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { publicacao_id, escritorio_id } = await req.json();
    
    if (!publicacao_id || !escritorio_id) {
      return Response.json({ error: 'Parâmetros obrigatórios ausentes' }, { status: 400 });
    }

    const publicacao = await base44.asServiceRole.entities.PublicacaoProcesso.filter({ id: publicacao_id });
    if (!publicacao[0]) {
      return Response.json({ error: 'Publicação não encontrada' }, { status: 404 });
    }

    const pub = publicacao[0];
    const conteudo = pub.conteudo.toLowerCase();

    // Buscar regras existentes
    const regras = await base44.asServiceRole.entities.RegraPrazo.filter({
      escritorio_id,
      ativa: true
    });

    // Detectar tipo de prazo por palavras-chave
    const tiposDetectados = [];
    if (/contest[aã]ção/.test(conteudo)) tiposDetectados.push({ tipo: 'Contestação', dias: 15, confianca: 85 });
    if (/recurso|apela[cç][aã]o/.test(conteudo)) tiposDetectados.push({ tipo: 'Recurso', dias: 15, confianca: 80 });
    if (/manifest[aã]ção/.test(conteudo)) tiposDetectados.push({ tipo: 'Manifestação', dias: 10, confianca: 75 });
    if (/contrarraz[oõ]es/.test(conteudo)) tiposDetectados.push({ tipo: 'Contrarrazões', dias: 15, confianca: 80 });
    if (/r[eé]plica/.test(conteudo)) tiposDetectados.push({ tipo: 'Réplica', dias: 10, confianca: 70 });
    if (/embargos/.test(conteudo)) tiposDetectados.push({ tipo: 'Embargos', dias: 5, confianca: 85 });

    if (tiposDetectados.length === 0) {
      return Response.json({
        success: false,
        message: 'Tipo de prazo não identificado',
        sugestao: null
      });
    }

    // Usar a primeira detecção (maior confiança)
    let sugestao = tiposDetectados[0];

    // Verificar se existe regra específica
    const regraEspecifica = regras.find(r => r.tipo_prazo === sugestao.tipo);
    if (regraEspecifica) {
      sugestao.dias = regraEspecifica.dias_prazo;
      sugestao.confianca = Math.min(95, sugestao.confianca + 10);
      sugestao.fonte = 'regra';
    } else {
      sugestao.fonte = 'padrao';
    }

    // Calcular data de vencimento
    const dataPublicacao = new Date(pub.data_publicacao);
    const dataVencimento = new Date(dataPublicacao);
    dataVencimento.setDate(dataVencimento.getDate() + sugestao.dias);

    // Buscar palavras-chave detectadas
    const palavrasChave = [];
    if (/contest[aã]ção/.test(conteudo)) palavrasChave.push('contestação');
    if (/recurso/.test(conteudo)) palavrasChave.push('recurso');
    if (/manifest[aã]ção/.test(conteudo)) palavrasChave.push('manifestação');

    return Response.json({
      success: true,
      sugestao: {
        tipo_prazo: sugestao.tipo,
        dias: sugestao.dias,
        data_vencimento: dataVencimento.toISOString().split('T')[0],
        confianca: sugestao.confianca,
        palavras_chave: palavrasChave,
        fonte: sugestao.fonte
      }
    });

  } catch (error) {
    console.error('Erro em sugerirPrazoIA:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});