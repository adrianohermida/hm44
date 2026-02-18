import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { escritorio_id, use_ai, auto_link_tasks, confianca_minima } = await req.json();
    
    if (!escritorio_id) {
      return Response.json({ error: 'escritorio_id obrigatório' }, { status: 400 });
    }

    // Buscar publicações sem prazo calculado
    const publicacoes = await base44.asServiceRole.entities.PublicacaoProcesso.filter({
      escritorio_id,
      prazo_calculado: false,
      gera_prazo: true
    });

    // Buscar regras de prazo ativas
    const regras = await base44.asServiceRole.entities.RegraPrazo.filter({
      escritorio_id,
      ativa: true
    });

    const stats = {
      prazos_criados: 0,
      tarefas_criadas: 0,
      erros: []
    };

    for (const pub of publicacoes) {
      try {
        // Detectar tipo de prazo
        const tipoPrazo = detectarTipoPrazo(pub.conteudo);
        let prazoDias = calcularPrazoDias(pub.conteudo);
        
        // Buscar regra aplicável
        const regraAplicavel = regras.find(r => r.tipo_prazo === tipoPrazo);
        
        if (regraAplicavel) {
          prazoDias = regraAplicavel.dias_prazo;
        }
        
        if (!prazoDias) continue;

        // Usar função robusta de cálculo com feriados
        const resultadoCalculo = await base44.asServiceRole.functions.invoke('calcularPrazoComFeriados', {
          data_inicio: pub.data_publicacao,
          dias_prazo: prazoDias,
          tipo_contagem: regraAplicavel?.tipo_contagem || 'Disponibilização DJE',
          tipo_dias: regraAplicavel?.tipo_dias || 'Dias Úteis',
          tribunal: pub.orgao,
          escritorio_id
        });
        
        const dataVencimento = resultadoCalculo.data.data_vencimento;
        
        const confianca = use_ai ? calcularConfianciaIA(pub.conteudo, prazoDias) : null;
        
        // Criar prazo
        const prazo = await base44.asServiceRole.entities.Prazo.create({
          escritorio_id,
          processo_id: pub.processo_id,
          publicacao_id: pub.id,
          titulo: `Prazo: ${pub.tipo || 'Publicação'}`,
          tipo: detectarTipoPrazo(pub.conteudo),
          tipo_prazo: tipoPrazo,
          data_publicacao: pub.data_publicacao,
          data_vencimento: dataVencimento,
          dias_prazo: prazoDias,
          tipo_contagem: regraAplicavel?.tipo_contagem || 'Disponibilização DJE',
          base_legal: regraAplicavel?.base_legal || null,
          dias_corridos: false,
          origem_calculo: regraAplicavel ? 'regra' : (use_ai ? 'ia' : 'manual'),
          confianca_ia: confianca,
          requer_aprovacao: use_ai && confianca < confianca_minima,
          status: 'pendente'
        });

        // Atualizar publicação
        await base44.asServiceRole.entities.PublicacaoProcesso.update(pub.id, {
          prazo_id: prazo.id,
          prazo_calculado: true
        });

        stats.prazos_criados++;

      } catch (error) {
        stats.erros.push({ publicacao_id: pub.id, erro: error.message });
      }
    }

    return Response.json({
      success: true,
      ...stats
    });

  } catch (error) {
    console.error('Erro em calcularPrazosEmMassa:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function calcularPrazoDias(conteudo) {
  const lower = conteudo.toLowerCase();
  
  if (lower.includes('contestação') || lower.includes('contestacao')) return 15;
  if (lower.includes('recurso inominado')) return 10;
  if (lower.includes('apelação') || lower.includes('apelacao')) return 15;
  if (lower.includes('embargos')) return 5;
  if (lower.includes('manifestação') || lower.includes('manifestacao')) return 10;
  
  const match = conteudo.match(/(\d+)\s*dias?\s*(úteis|corridos)?/i);
  if (match) return parseInt(match[1]);
  
  return 5;
}

function calcularDataVencimento(dataBase, dias) {
  if (!dataBase) return null;
  
  const date = new Date(dataBase);
  let diasAdicionados = 0;
  
  // Adicionar apenas dias úteis
  while (diasAdicionados < dias) {
    date.setDate(date.getDate() + 1);
    const diaSemana = date.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasAdicionados++;
    }
  }
  
  return date.toISOString().split('T')[0];
}

function detectarTipoPrazo(conteudo) {
  const lower = conteudo.toLowerCase();
  
  if (lower.includes('contestação') || lower.includes('contestacao')) return 'contestacao';
  if (lower.includes('recurso')) return 'recurso';
  if (lower.includes('manifestação') || lower.includes('manifestacao')) return 'manifestacao';
  if (lower.includes('petição') || lower.includes('peticao')) return 'peticao';
  if (lower.includes('cumprimento')) return 'cumprimento';
  
  return 'outro';
}

function calcularConfianciaIA(conteudo, dias) {
  // Confiança baseada em palavras-chave claras
  const lower = conteudo.toLowerCase();
  
  if (lower.includes('prazo de') && conteudo.match(/\d+\s*dias/i)) return 90;
  if (lower.includes('contestação') || lower.includes('recurso')) return 85;
  if (lower.includes('manifestação')) return 75;
  
  return 60;
}