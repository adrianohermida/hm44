import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numero_cnj, cursor, buscar_todas = false, processo_id } = await req.json();
    if (!numero_cnj) return Response.json({ error: 'numero_cnj obrigatório' }, { status: 400 });

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'Token Escavador não configurado' }, { status: 500 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorios[0]?.id) {
      return Response.json({ error: 'Você não está vinculado a nenhum escritório' }, { status: 403 });
    }
    const escritorioId = escritorios[0].id;

    // Buscar todas as páginas se solicitado
    if (buscar_todas && processo_id) {
      let todasMovimentacoes = [];
      let nextCursor = null;
      let totalSalvas = 0;

      do {
        const url = new URL(`https://api.escavador.com/api/v2/processos/numero_cnj/${numero_cnj}/movimentacoes`);
        if (nextCursor) url.searchParams.set('cursor', nextCursor);

        const startTime = Date.now();
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        const tempo_resposta_ms = Date.now() - startTime;

        // Registrar consumo de cada página
        await base44.asServiceRole.entities.ConsumoAPIExterna.create({
          escritorio_id: escritorioId,
          usuario_email: user.email,
          provedor_id: '6949735a71244b18c7a49e5e',
          endpoint_id: '695078494870a07fcfac171f',
          operacao: 'producao',
          parametros: { numero_cnj, cursor: nextCursor || null, pagina: todasMovimentacoes.length / 20 + 1 },
          sucesso: response.ok,
          http_status: response.status,
          creditos_consumidos: response.ok ? 1 : 0,
          tempo_resposta_ms
        });

        if (!response.ok) break;

        const data = await response.json();
        const items = data.items || [];
        
        // Salvar movimentações no banco
        for (const mov of items) {
          try {
            await base44.asServiceRole.entities.MovimentacaoProcesso.create({
              processo_id,
              escritorio_id: escritorioId,
              escavador_id: mov.id,
              data: mov.data || null,
              tipo: mov.tipo || '',
              conteudo: mov.conteudo || '',
              pagina: mov.pagina || null,
              tipo_publicacao: mov.tipo_publicacao || null,
              texto_categoria: mov.texto_categoria || null,
              classificacao_predita_nome: mov.classificacao_predita?.nome || null,
              classificacao_predita_descricao: mov.classificacao_predita?.descricao || null,
              classificacao_predita_hierarquia: mov.classificacao_predita?.hierarquia || null,
              fonte_processo_fonte_id: mov.fonte?.processo_fonte_id || null,
              fonte_id: mov.fonte?.fonte_id || null,
              fonte_nome: mov.fonte?.nome || '',
              fonte_tipo: mov.fonte?.tipo || '',
              fonte_sigla: mov.fonte?.sigla || '',
              fonte_grau: mov.fonte?.grau || 1,
              fonte_grau_formatado: mov.fonte?.grau_formatado || '',
              fonte_caderno: mov.fonte?.caderno || null,
              fonte_link_web: mov.fonte?.link_web || null
            });
            totalSalvas++;
          } catch (e) {
            // Ignora duplicados
          }
        }

        todasMovimentacoes = todasMovimentacoes.concat(items);
        nextCursor = data.links?.next ? new URL(data.links.next).searchParams.get('cursor') : null;

      } while (nextCursor);

      return Response.json({ 
        success: true, 
        total_movimentacoes: todasMovimentacoes.length,
        movimentacoes_salvas: totalSalvas,
        items: todasMovimentacoes 
      });
    }

    // Busca única (modo original)
    const url = new URL(`https://api.escavador.com/api/v2/processos/numero_cnj/${numero_cnj}/movimentacoes`);
    if (cursor) url.searchParams.set('cursor', cursor);

    const startTime = Date.now();
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        error: `API retornou status ${response.status}`,
        items: []
      }, { status: response.status });
    }

    const data = await response.json();
    const tempo_resposta_ms = Date.now() - startTime;

    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: escritorioId,
      usuario_email: user.email,
      provedor_id: '6949735a71244b18c7a49e5e',
      endpoint_id: '695078494870a07fcfac171f',
      operacao: 'producao',
      parametros: { numero_cnj, cursor: cursor || null },
      sucesso: response.ok,
      http_status: response.status,
      creditos_consumidos: response.ok ? 1 : 0,
      tempo_resposta_ms
    });

    return Response.json(data || { items: [] });
  } catch (error) {
    console.error('[listarMovimentacoes] Erro:', error);
    return Response.json({ 
      error: error.message, 
      items: [] 
    }, { status: 500 });
  }
});