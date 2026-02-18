import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numero_cnj, processo_id, salvar = false, page = 1, tipo_filtro = 'TODOS' } = await req.json();
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

    // Usar endpoint /autos para pegar documentos públicos e restritos
    const url = `https://api.escavador.com/api/v2/processos/numero_cnj/${numero_cnj}/autos?page=${page}`;

    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const tempo_resposta_ms = Date.now() - startTime;

    // Registrar consumo
    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: escritorioId,
      usuario_email: user.email,
      provedor_id: '6949735a71244b18c7a49e5e',
      endpoint_id: '69507b7702bbb728785a9b08',
      operacao: 'producao',
      parametros: { numero_cnj },
      sucesso: response.ok,
      http_status: response.status,
      creditos_consumidos: response.ok ? 1 : 0,
      tempo_resposta_ms
    });

    if (!response.ok) {
      return Response.json({ 
        error: `API retornou status ${response.status}`,
        items: []
      }, { status: response.status });
    }

    const data = await response.json();
    const items = data.items || [];
    
    // Aplicar filtro de tipo se solicitado
    const documentosFiltrados = tipo_filtro === 'TODOS' 
      ? items 
      : items.filter(doc => doc.tipo === tipo_filtro);

    // Salvar documentos no banco se solicitado
    if (salvar && processo_id && documentosFiltrados.length > 0) {
      let totalSalvos = 0;
      
      for (const doc of documentosFiltrados) {
        try {
          await base44.asServiceRole.entities.DocumentoPublico.create({
            processo_id,
            escritorio_id: escritorioId,
            escavador_id: doc.id,
            titulo: doc.titulo,
            descricao: doc.descricao,
            data: doc.data,
            tipo: doc.tipo,
            extensao_arquivo: doc.extensao_arquivo,
            quantidade_paginas: doc.quantidade_paginas,
            key: doc.key,
            url_api: doc.links?.api
          });
          totalSalvos++;
        } catch (e) {
          // Ignora duplicados
        }
      }

      return Response.json({ 
        success: true, 
        total_documentos: documentosFiltrados.length,
        documentos_salvos: totalSalvos,
        items: documentosFiltrados,
        paginator: data.paginator,
        links: data.links
      });
    }

    return Response.json({
      items: documentosFiltrados,
      paginator: data.paginator,
      links: data.links
    });
  } catch (error) {
    console.error('[listarDocumentosPublicos] Erro:', error);
    return Response.json({ 
      error: error.message, 
      items: [] 
    }, { status: 500 });
  }
});