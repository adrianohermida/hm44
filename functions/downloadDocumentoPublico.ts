import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { documento_publico_id } = await req.json();

    if (!documento_publico_id) {
      return Response.json({ error: 'documento_publico_id obrigatório' }, { status: 400 });
    }

    // Buscar documento
    const docs = await base44.asServiceRole.entities.DocumentoPublico.list();
    const documento = docs.find(d => d.id === documento_publico_id);

    if (!documento) {
      return Response.json({ error: 'Documento não encontrado' }, { status: 404 });
    }

    // Obter escritório
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorios[0]?.id) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 403 });
    }

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    
    // URL da API Escavador para download
    const downloadUrl = `https://api.escavador.com/api/v2/documentos/${documento.key}/download`;

    // Fazer requisição para obter URL de download
    const startTime = Date.now();
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const tempo_resposta_ms = Date.now() - startTime;

    // Registrar consumo
    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: escritorios[0].id,
      usuario_email: user.email,
      provedor_id: '6949735a71244b18c7a49e5e',
      endpoint_id: '695078494870a07fcfac171f',
      operacao: 'producao',
      parametros: { documento_key: documento.key },
      sucesso: response.ok,
      http_status: response.status,
      creditos_consumidos: response.ok ? 1 : 0,
      tempo_resposta_ms
    });

    if (!response.ok) {
      return Response.json({ 
        error: `API Escavador retornou status ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();

    // A API Escavador retorna { url: "..." } com a URL de download
    if (data.url) {
      return Response.json({ url: data.url });
    }

    return Response.json({ 
      error: 'URL de download não disponível' 
    }, { status: 404 });

  } catch (error) {
    console.error('[downloadDocumentoPublico] ERRO:', error);
    return Response.json({ 
      error: error.message || 'Erro ao buscar documento' 
    }, { status: 500 });
  }
});