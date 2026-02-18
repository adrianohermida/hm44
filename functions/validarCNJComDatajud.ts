import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import CNJParser from '../components/utils/CNJParser.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { numero_cnj } = await req.json();

    if (!numero_cnj) {
      return Response.json({ error: 'Número CNJ obrigatório' }, { status: 400 });
    }

    // 1. Parse básico + enriquecimento local
    const parseResult = await CNJParser.enrichCNJData(numero_cnj, base44);

    if (!parseResult.valido) {
      return Response.json({ 
        valido: false, 
        erro: parseResult.erro 
      });
    }

    // 2. Buscar no DataJud se disponível
    let dadosDatajud = null;
    if (parseResult.endpoint_datajud) {
      try {
        const datajudUrl = `https://api-publica.datajud.cnj.jus.br/${parseResult.endpoint_datajud}/_search`;
        const datajudPayload = {
          query: {
            match: {
              numeroProcesso: parseResult.limpo
            }
          },
          size: 1
        };

        const datajudResponse = await fetch(datajudUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `APIKey ${Deno.env.get('DATAJUD_API_TOKEN')}`
          },
          body: JSON.stringify(datajudPayload)
        });

        if (datajudResponse.ok) {
          const datajudData = await datajudResponse.json();
          const hit = datajudData.hits?.hits?.[0]?._source;

          if (hit) {
            dadosDatajud = {
              classe: hit.classe?.nome,
              classe_codigo: hit.classe?.codigo,
              assuntos: hit.assuntos?.map(a => ({
                nome: a.nome,
                codigo: a.codigo
              })),
              orgao_julgador: hit.orgaoJulgador?.nomeOrgao,
              valor_causa: hit.valorCausa,
              data_ajuizamento: hit.dataAjuizamento,
              grau: hit.grau,
              sistema: hit.sistema,
              partes: hit.partes?.map(p => ({
                nome: p.nome,
                polo: p.polo,
                tipo_pessoa: p.tipoPessoa
              }))
            };
          }
        }
      } catch (datajudError) {
        console.error('Erro ao consultar DataJud:', datajudError);
      }
    }

    return Response.json({
      valido: true,
      cnj_parse: {
        numero_formatado: parseResult.formatado,
        numero_limpo: parseResult.limpo,
        ano: parseResult.ano,
        tribunal: parseResult.tribunal_sigla,
        comarca: parseResult.comarca,
        vara: parseResult.vara,
        vara_tipo: parseResult.vara_tipo,
        segmento_justica: parseResult.info_segmento?.nome,
        endpoint_datajud: parseResult.endpoint_datajud
      },
      datajud: dadosDatajud,
      sugestao_titulo: dadosDatajud?.partes ? 
        gerarTituloProcesso(dadosDatajud.partes) : null
    });
  } catch (error) {
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});

function gerarTituloProcesso(partes) {
  const poloAtivo = partes.filter(p => p.polo === 'POLO_ATIVO' || p.polo === 'Autor').map(p => p.nome);
  const poloPassivo = partes.filter(p => p.polo === 'POLO_PASSIVO' || p.polo === 'Réu').map(p => p.nome);

  if (poloAtivo.length > 0 && poloPassivo.length > 0) {
    return `${poloAtivo.join(' e ')} x ${poloPassivo.join(' e ')}`;
  }

  return null;
}