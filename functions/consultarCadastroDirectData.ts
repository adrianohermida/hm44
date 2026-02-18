import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documento, tipoPessoa, tipoConsulta = 'basica' } = await req.json();
    
    if (!documento || !tipoPessoa) {
      return Response.json({ error: 'Documento e tipoPessoa são obrigatórios' }, { status: 400 });
    }

    const apiToken = Deno.env.get('DIRECTDATA_API_KEY');
    if (!apiToken) {
      return Response.json({ error: 'API token não configurado' }, { status: 500 });
    }

    // Determinar endpoint baseado no tipo
    let endpoint;
    if (tipoPessoa === 'fisica') {
      endpoint = tipoConsulta === 'plus' 
        ? `https://apiv3.directd.com.br/api/CadastroPessoaFisicaPlus?CPF=${documento}&TOKEN=${apiToken}`
        : `https://apiv3.directd.com.br/api/CadastroPessoaFisica?CPF=${documento}&TOKEN=${apiToken}`;
    } else {
      endpoint = tipoConsulta === 'plus'
        ? `https://apiv3.directd.com.br/api/CadastroPessoaJuridicaPlus?CNPJ=${documento}&TOKEN=${apiToken}`
        : `https://apiv3.directd.com.br/api/CadastroPessoaJuridica?CNPJ=${documento}&TOKEN=${apiToken}`;
    }

    const startTime = Date.now();
    const response = await fetch(endpoint, {
      headers: {
        'accept': 'application/json'
      }
    });

    const data = await response.json();
    const tempoResposta = Date.now() - startTime;

    // Registrar consumo
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    if (escritorioId) {
      await base44.asServiceRole.entities.ConsumoAPIExterna.create({
        escritorio_id: escritorioId,
        usuario_email: user.email,
        provedor_id: 'directdata',
        endpoint_id: tipoPessoa === 'fisica' 
          ? (tipoConsulta === 'plus' ? '694999729d2ed8feb8ddbb9e' : '694999729d2ed8feb8ddbb9d')
          : (tipoConsulta === 'plus' ? '694999729d2ed8feb8ddbaef' : '694999729d2ed8feb8ddbb9f'),
        operacao: `cadastro_${tipoPessoa}_${tipoConsulta}`,
        parametros: { documento, tipoPessoa, tipoConsulta },
        sucesso: response.ok,
        http_status: response.status,
        tempo_resposta_ms: tempoResposta,
        creditos_consumidos: tipoConsulta === 'plus' ? (tipoPessoa === 'fisica' ? 0.22 : 0.36) : 0.16,
        custo_estimado: tipoConsulta === 'plus' ? (tipoPessoa === 'fisica' ? 0.22 : 0.36) : 0.16
      });
    }

    if (!response.ok) {
      return Response.json({ 
        error: 'Erro ao consultar API DirectData',
        details: data 
      }, { status: response.status });
    }

    return Response.json({
      success: true,
      data: data.retorno,
      metaDados: data.metaDados
    });

  } catch (error) {
    console.error('Erro consultarCadastroDirectData:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});