import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { escritorio_id } = await req.json();
    
    if (!escritorio_id) {
      return Response.json({ error: 'escritorio_id obrigatório' }, { status: 400 });
    }

    // Buscar aprendizados confirmados
    const aprendizados = await base44.asServiceRole.entities.AprendizadoCalculoPrazo.filter({
      escritorio_id,
      'confirmacao_usuario.aceito': true
    });

    if (aprendizados.length === 0) {
      return Response.json({
        success: false,
        message: 'Nenhum aprendizado confirmado para treinar'
      });
    }

    // Agrupar por tipo de prazo
    const grupos = {};
    aprendizados.forEach(a => {
      const tipo = a.confirmacao_usuario.tipo_prazo_final;
      if (!grupos[tipo]) {
        grupos[tipo] = [];
      }
      grupos[tipo].push(a);
    });

    // Validar mínimo de dados
    if (Object.keys(grupos).length === 0) {
      return Response.json({
        success: false,
        message: 'Nenhum tipo de prazo com dados suficientes'
      });
    }

    // Criar/atualizar regras baseadas em aprendizados
    const regrasAtualizadas = [];
    
    for (const [tipo, items] of Object.entries(grupos)) {
      if (items.length < 3) {
        console.log(`Tipo ${tipo} ignorado: apenas ${items.length} confirmações (mínimo: 3)`);
        continue;
      }
      
      // Calcular média de dias
      const dias = items.map(i => i.confirmacao_usuario.dias_final);
      const mediaDias = Math.round(dias.reduce((a, b) => a + b, 0) / dias.length);
      
      // Calcular precisão
      const acertos = items.filter(i => !i.confirmacao_usuario.ajustou).length;
      const precisao = Math.round((acertos / items.length) * 100);
      
      // Buscar regra existente
      const regrasExistentes = await base44.asServiceRole.entities.RegraPrazo.filter({
        escritorio_id,
        tipo_prazo: tipo,
        gerada_automaticamente: true
      });

      if (regrasExistentes.length > 0) {
        // Atualizar regra
        const regra = regrasExistentes[0];
        await base44.asServiceRole.entities.RegraPrazo.update(regra.id, {
          dias_prazo: mediaDias,
          vezes_aplicada: (regra.vezes_aplicada || 0) + items.length,
          taxa_sucesso: precisao,
          observacoes: `Atualizado via IA: ${items.length} confirmações (${precisao}% precisão)`
        });
        regrasAtualizadas.push(tipo);
      } else {
        // Criar nova regra
        await base44.asServiceRole.entities.RegraPrazo.create({
          escritorio_id,
          nome: `${tipo} (IA)`,
          tipo_prazo: tipo,
          dias_prazo: mediaDias,
          tipo_dias: 'Dias Úteis',
          tipo_contagem: 'Disponibilização DJE',
          ativa: true,
          gerada_automaticamente: true,
          vezes_aplicada: items.length,
          taxa_sucesso: precisao,
          observacoes: `Criado via IA: ${items.length} confirmações (${precisao}% precisão)`
        });
        regrasAtualizadas.push(tipo);
      }
    }

    // Marcar aprendizados como aplicados
    await Promise.all(
      aprendizados.map(a => 
        base44.asServiceRole.entities.AprendizadoCalculoPrazo.update(a.id, {
          melhoria_aplicada: true
        })
      )
    );

    return Response.json({
      success: true,
      regras_atualizadas: regrasAtualizadas.length,
      tipos_treinados: regrasAtualizadas,
      total_aprendizados: aprendizados.length
    });

  } catch (error) {
    console.error('Erro em treinarIAPrazos:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});