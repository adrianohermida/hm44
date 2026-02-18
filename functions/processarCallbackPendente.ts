import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { callback_id, processo_id } = await req.json();

    if (!callback_id) {
      return Response.json({ error: 'callback_id obrigatório' }, { status: 400 });
    }

    // Buscar callback
    const callbacks = await base44.entities.CallbackEscavador.filter({ id: callback_id });
    if (callbacks.length === 0) {
      return Response.json({ error: 'Callback não encontrado' }, { status: 404 });
    }

    const callback = callbacks[0];

    if (callback.processado) {
      return Response.json({ 
        message: 'Callback já foi processado',
        processado_em: callback.processado_em 
      });
    }

    // Processar callback baseado no tipo
    let resultado = {};

    if (callback.evento === 'resultado_processo_async' || callback.evento === 'resultado_atualizacao') {
      const resposta = callback.resultado?.resposta;
      
      if (resposta && processo_id) {
        // Salvar documentos públicos
        const instancias = resposta.instancias || [];
        let totalDocs = 0;

        for (const inst of instancias) {
          if (inst.movimentacoes) {
            totalDocs += inst.movimentacoes.length;
          }
        }

        resultado = {
          tipo: 'documentos',
          total_documentos: totalDocs,
          instancias_processadas: instancias.length
        };
      }
    }

    // Marcar como processado
    await base44.entities.CallbackEscavador.update(callback_id, {
      processado: true,
      processado_em: new Date().toISOString(),
      tipo_processamento: callback.evento
    });

    return Response.json({
      success: true,
      callback,
      resultado
    });

  } catch (error) {
    console.error('[processarCallbackPendente] Erro:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});