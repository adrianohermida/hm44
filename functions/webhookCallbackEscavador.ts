import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Callback vem sem autenticação do usuário - usar service role
    const payload = await req.json();
    
    console.log('[Callback Escavador] Recebido:', JSON.stringify(payload).slice(0, 500));

    // Extrair dados do callback
    const { 
      uuid, 
      evento, 
      resultado, 
      objeto_id, 
      objeto_type,
      status 
    } = payload;

    // Identificar processo pelo número CNJ
    const numeroCNJ = resultado?.numero_processo || 
                      resultado?.processo?.numero_unico || 
                      resultado?.processo?.numero_novo;

    if (!numeroCNJ) {
      console.log('[Callback] Número CNJ não encontrado no payload');
      return Response.json({ 
        received: true, 
        message: 'CNJ não encontrado' 
      });
    }

    // Buscar processo local
    const processos = await base44.asServiceRole.entities.Processo.filter({
      numero_cnj: numeroCNJ.replace(/\D/g, '')
    });

    if (processos.length === 0) {
      console.log('[Callback] Processo não encontrado:', numeroCNJ);
      return Response.json({ 
        received: true, 
        message: 'Processo não cadastrado' 
      });
    }

    const processo = processos[0];

    // Salvar callback
    await base44.asServiceRole.entities.CallbackEscavador.create({
      escritorio_id: processo.escritorio_id,
      callback_id: payload.id,
      uuid,
      evento,
      objeto_type,
      objeto_id,
      status: status || 'Sucesso',
      attempts: payload.attempts || 0,
      delivered_at: payload.delivered_at,
      numero_cnj: numeroCNJ,
      processo_id: processo.id,
      resultado: payload,
      processado: false
    });

    // Processar callback baseado no evento
    if (evento === 'resultado_processo_async' || evento === 'resultado_atualizacao') {
      // Atualização de processo concluída
      if (resultado?.resposta) {
        // Salvar documentos públicos se disponíveis
        const instancias = resultado.resposta.instancias || [];
        
        for (const inst of instancias) {
          // Processar movimentações, documentos, etc
          if (inst.movimentacoes) {
            console.log(`[Callback] ${inst.movimentacoes.length} movimentações disponíveis`);
          }
        }

        // Marcar callback como processado
        await base44.asServiceRole.entities.CallbackEscavador.update(
          uuid,
          { 
            processado: true, 
            processado_em: new Date().toISOString(),
            tipo_processamento: 'atualizar_processo'
          }
        );
      }
    }

    return Response.json({ 
      received: true, 
      processed: true,
      processo_id: processo.id
    });

  } catch (error) {
    console.error('[Callback Escavador] Erro:', error);
    return Response.json({ 
      received: true, 
      error: error.message 
    }, { status: 500 });
  }
});