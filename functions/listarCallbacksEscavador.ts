import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const data_minima = searchParams.get('data_minima');
    const data_maxima = searchParams.get('data_maxima');
    const evento = searchParams.get('evento');
    const item_tipo = searchParams.get('item_tipo');
    const item_id = searchParams.get('item_id');
    const status = searchParams.get('status');

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'Token não configurado' }, { status: 500 });
    }

    // Construir query params
    const params = new URLSearchParams();
    if (data_minima) params.append('data_minima', data_minima);
    if (data_maxima) params.append('data_maxima', data_maxima);
    if (evento) params.append('evento', evento);
    if (item_tipo) params.append('item_tipo', item_tipo);
    if (item_id) params.append('item_id', item_id);
    if (status) params.append('status', status);

    const url = `https://api.escavador.com/api/v2/callbacks?${params.toString()}`;

    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const tempo_resposta_ms = Date.now() - startTime;

    // Registrar consumo (endpoint de listar callbacks é GRÁTIS)
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    if (escritorioId) {
      await base44.asServiceRole.entities.ConsumoAPIExterna.create({
        escritorio_id: escritorioId,
        usuario_email: user.email,
        provedor_id: '6949735a71244b18c7a49e5e',
        endpoint_id: 'listar_callbacks',
        operacao: 'producao',
        parametros: Object.fromEntries(params),
        sucesso: response.ok,
        http_status: response.status,
        creditos_consumidos: 0, // GRÁTIS
        tempo_resposta_ms
      });
    }

    if (!response.ok) {
      const error = await response.json();
      return Response.json({ error }, { status: response.status });
    }

    const data = await response.json();
    
    // Salvar callbacks no banco de dados
    if (data.items && escritorioId) {
      for (const callback of data.items) {
        const numeroCNJ = callback.resultado?.numero_processo || 
                         callback.resultado?.processo?.numero_novo ||
                         callback.resultado?.monitoramento?.[0]?.processo?.numero_novo;

        // Buscar processo local
        let processoId = null;
        if (numeroCNJ) {
          const processos = await base44.asServiceRole.entities.Processo.filter({
            numero_cnj: numeroCNJ.replace(/\D/g, ''),
            escritorio_id: escritorioId
          });
          processoId = processos[0]?.id;
        }

        // Verificar se já existe
        const existing = await base44.asServiceRole.entities.CallbackEscavador.filter({
          uuid: callback.uuid
        });

        if (existing.length === 0) {
          await base44.asServiceRole.entities.CallbackEscavador.create({
            escritorio_id: escritorioId,
            callback_id: callback.id,
            uuid: callback.uuid,
            evento: callback.evento || 'desconhecido',
            objeto_type: callback.objeto_type,
            objeto_id: callback.objeto_id,
            status: callback.status,
            attempts: callback.attempts,
            delivered_at: callback.delivered_at,
            numero_cnj: numeroCNJ,
            processo_id: processoId,
            resultado: callback.resultado,
            processado: false
          });
        }
      }
    }

    return Response.json(data);

  } catch (error) {
    console.error('[listarCallbacksEscavador] Erro:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});