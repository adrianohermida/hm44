import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const TODOS_TRIBUNAIS = [
  // Tribunais Superiores
  { alias: 'api_publica_tst', nome: 'TST', fullName: 'Tribunal Superior do Trabalho', tipo: 'Superior' },
  { alias: 'api_publica_tse', nome: 'TSE', fullName: 'Tribunal Superior Eleitoral', tipo: 'Superior' },
  { alias: 'api_publica_stj', nome: 'STJ', fullName: 'Superior Tribunal de Justiça', tipo: 'Superior' },
  { alias: 'api_publica_stm', nome: 'STM', fullName: 'Superior Tribunal Militar', tipo: 'Superior' },
  
  // Justiça Federal
  { alias: 'api_publica_trf1', nome: 'TRF1', fullName: 'TRF 1ª Região', tipo: 'Federal' },
  { alias: 'api_publica_trf2', nome: 'TRF2', fullName: 'TRF 2ª Região', tipo: 'Federal' },
  { alias: 'api_publica_trf3', nome: 'TRF3', fullName: 'TRF 3ª Região', tipo: 'Federal' },
  { alias: 'api_publica_trf4', nome: 'TRF4', fullName: 'TRF 4ª Região', tipo: 'Federal' },
  { alias: 'api_publica_trf5', nome: 'TRF5', fullName: 'TRF 5ª Região', tipo: 'Federal' },
  { alias: 'api_publica_trf6', nome: 'TRF6', fullName: 'TRF 6ª Região', tipo: 'Federal' },
  
  // Justiça Estadual
  { alias: 'api_publica_tjac', nome: 'TJAC', fullName: 'TJ do Acre', tipo: 'Estadual' },
  { alias: 'api_publica_tjal', nome: 'TJAL', fullName: 'TJ de Alagoas', tipo: 'Estadual' },
  { alias: 'api_publica_tjam', nome: 'TJAM', fullName: 'TJ do Amazonas', tipo: 'Estadual' },
  { alias: 'api_publica_tjap', nome: 'TJAP', fullName: 'TJ do Amapá', tipo: 'Estadual' },
  { alias: 'api_publica_tjba', nome: 'TJBA', fullName: 'TJ da Bahia', tipo: 'Estadual' },
  { alias: 'api_publica_tjce', nome: 'TJCE', fullName: 'TJ do Ceará', tipo: 'Estadual' },
  { alias: 'api_publica_tjdft', nome: 'TJDFT', fullName: 'TJ do Distrito Federal', tipo: 'Estadual' },
  { alias: 'api_publica_tjes', nome: 'TJES', fullName: 'TJ do Espírito Santo', tipo: 'Estadual' },
  { alias: 'api_publica_tjgo', nome: 'TJGO', fullName: 'TJ de Goiás', tipo: 'Estadual' },
  { alias: 'api_publica_tjma', nome: 'TJMA', fullName: 'TJ do Maranhão', tipo: 'Estadual' },
  { alias: 'api_publica_tjmg', nome: 'TJMG', fullName: 'TJ de Minas Gerais', tipo: 'Estadual' },
  { alias: 'api_publica_tjms', nome: 'TJMS', fullName: 'TJ do Mato Grosso do Sul', tipo: 'Estadual' },
  { alias: 'api_publica_tjmt', nome: 'TJMT', fullName: 'TJ do Mato Grosso', tipo: 'Estadual' },
  { alias: 'api_publica_tjpa', nome: 'TJPA', fullName: 'TJ do Pará', tipo: 'Estadual' },
  { alias: 'api_publica_tjpb', nome: 'TJPB', fullName: 'TJ da Paraíba', tipo: 'Estadual' },
  { alias: 'api_publica_tjpe', nome: 'TJPE', fullName: 'TJ de Pernambuco', tipo: 'Estadual' },
  { alias: 'api_publica_tjpi', nome: 'TJPI', fullName: 'TJ do Piauí', tipo: 'Estadual' },
  { alias: 'api_publica_tjpr', nome: 'TJPR', fullName: 'TJ do Paraná', tipo: 'Estadual' },
  { alias: 'api_publica_tjrj', nome: 'TJRJ', fullName: 'TJ do Rio de Janeiro', tipo: 'Estadual' },
  { alias: 'api_publica_tjrn', nome: 'TJRN', fullName: 'TJ do Rio Grande do Norte', tipo: 'Estadual' },
  { alias: 'api_publica_tjro', nome: 'TJRO', fullName: 'TJ de Rondônia', tipo: 'Estadual' },
  { alias: 'api_publica_tjrr', nome: 'TJRR', fullName: 'TJ de Roraima', tipo: 'Estadual' },
  { alias: 'api_publica_tjrs', nome: 'TJRS', fullName: 'TJ do Rio Grande do Sul', tipo: 'Estadual' },
  { alias: 'api_publica_tjsc', nome: 'TJSC', fullName: 'TJ de Santa Catarina', tipo: 'Estadual' },
  { alias: 'api_publica_tjse', nome: 'TJSE', fullName: 'TJ de Sergipe', tipo: 'Estadual' },
  { alias: 'api_publica_tjsp', nome: 'TJSP', fullName: 'TJ de São Paulo', tipo: 'Estadual' },
  { alias: 'api_publica_tjto', nome: 'TJTO', fullName: 'TJ do Tocantins', tipo: 'Estadual' },
  
  // Justiça do Trabalho
  { alias: 'api_publica_trt1', nome: 'TRT1', fullName: 'TRT 1ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt2', nome: 'TRT2', fullName: 'TRT 2ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt3', nome: 'TRT3', fullName: 'TRT 3ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt4', nome: 'TRT4', fullName: 'TRT 4ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt5', nome: 'TRT5', fullName: 'TRT 5ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt6', nome: 'TRT6', fullName: 'TRT 6ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt7', nome: 'TRT7', fullName: 'TRT 7ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt8', nome: 'TRT8', fullName: 'TRT 8ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt9', nome: 'TRT9', fullName: 'TRT 9ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt10', nome: 'TRT10', fullName: 'TRT 10ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt11', nome: 'TRT11', fullName: 'TRT 11ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt12', nome: 'TRT12', fullName: 'TRT 12ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt13', nome: 'TRT13', fullName: 'TRT 13ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt14', nome: 'TRT14', fullName: 'TRT 14ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt15', nome: 'TRT15', fullName: 'TRT 15ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt16', nome: 'TRT16', fullName: 'TRT 16ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt17', nome: 'TRT17', fullName: 'TRT 17ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt18', nome: 'TRT18', fullName: 'TRT 18ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt19', nome: 'TRT19', fullName: 'TRT 19ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt20', nome: 'TRT20', fullName: 'TRT 20ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt21', nome: 'TRT21', fullName: 'TRT 21ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt22', nome: 'TRT22', fullName: 'TRT 22ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt23', nome: 'TRT23', fullName: 'TRT 23ª Região', tipo: 'Trabalho' },
  { alias: 'api_publica_trt24', nome: 'TRT24', fullName: 'TRT 24ª Região', tipo: 'Trabalho' },
  
  // Justiça Eleitoral
  { alias: 'api_publica_treac', nome: 'TRE-AC', fullName: 'TRE do Acre', tipo: 'Eleitoral' },
  { alias: 'api_publica_treal', nome: 'TRE-AL', fullName: 'TRE de Alagoas', tipo: 'Eleitoral' },
  { alias: 'api_publica_tream', nome: 'TRE-AM', fullName: 'TRE do Amazonas', tipo: 'Eleitoral' },
  { alias: 'api_publica_treap', nome: 'TRE-AP', fullName: 'TRE do Amapá', tipo: 'Eleitoral' },
  { alias: 'api_publica_treba', nome: 'TRE-BA', fullName: 'TRE da Bahia', tipo: 'Eleitoral' },
  { alias: 'api_publica_trece', nome: 'TRE-CE', fullName: 'TRE do Ceará', tipo: 'Eleitoral' },
  { alias: 'api_publica_tredft', nome: 'TRE-DFT', fullName: 'TRE do Distrito Federal', tipo: 'Eleitoral' },
  { alias: 'api_publica_trees', nome: 'TRE-ES', fullName: 'TRE do Espírito Santo', tipo: 'Eleitoral' },
  { alias: 'api_publica_trego', nome: 'TRE-GO', fullName: 'TRE de Goiás', tipo: 'Eleitoral' },
  { alias: 'api_publica_trema', nome: 'TRE-MA', fullName: 'TRE do Maranhão', tipo: 'Eleitoral' },
  { alias: 'api_publica_tremg', nome: 'TRE-MG', fullName: 'TRE de Minas Gerais', tipo: 'Eleitoral' },
  { alias: 'api_publica_trems', nome: 'TRE-MS', fullName: 'TRE do Mato Grosso do Sul', tipo: 'Eleitoral' },
  { alias: 'api_publica_tremt', nome: 'TRE-MT', fullName: 'TRE do Mato Grosso', tipo: 'Eleitoral' },
  { alias: 'api_publica_trepa', nome: 'TRE-PA', fullName: 'TRE do Pará', tipo: 'Eleitoral' },
  { alias: 'api_publica_trepb', nome: 'TRE-PB', fullName: 'TRE da Paraíba', tipo: 'Eleitoral' },
  { alias: 'api_publica_trepe', nome: 'TRE-PE', fullName: 'TRE de Pernambuco', tipo: 'Eleitoral' },
  { alias: 'api_publica_trepi', nome: 'TRE-PI', fullName: 'TRE do Piauí', tipo: 'Eleitoral' },
  { alias: 'api_publica_trepr', nome: 'TRE-PR', fullName: 'TRE do Paraná', tipo: 'Eleitoral' },
  { alias: 'api_publica_trerj', nome: 'TRE-RJ', fullName: 'TRE do Rio de Janeiro', tipo: 'Eleitoral' },
  { alias: 'api_publica_trern', nome: 'TRE-RN', fullName: 'TRE do Rio Grande do Norte', tipo: 'Eleitoral' },
  { alias: 'api_publica_trero', nome: 'TRE-RO', fullName: 'TRE de Rondônia', tipo: 'Eleitoral' },
  { alias: 'api_publica_trerr', nome: 'TRE-RR', fullName: 'TRE de Roraima', tipo: 'Eleitoral' },
  { alias: 'api_publica_trers', nome: 'TRE-RS', fullName: 'TRE do Rio Grande do Sul', tipo: 'Eleitoral' },
  { alias: 'api_publica_tresc', nome: 'TRE-SC', fullName: 'TRE de Santa Catarina', tipo: 'Eleitoral' },
  { alias: 'api_publica_trese', nome: 'TRE-SE', fullName: 'TRE de Sergipe', tipo: 'Eleitoral' },
  { alias: 'api_publica_tresp', nome: 'TRE-SP', fullName: 'TRE de São Paulo', tipo: 'Eleitoral' },
  { alias: 'api_publica_treto', nome: 'TRE-TO', fullName: 'TRE do Tocantins', tipo: 'Eleitoral' },
  
  // Justiça Militar
  { alias: 'api_publica_tjmmg', nome: 'TJMMG', fullName: 'TJM de Minas Gerais', tipo: 'Militar' },
  { alias: 'api_publica_tjmrs', nome: 'TJMRS', fullName: 'TJM do Rio Grande do Sul', tipo: 'Militar' },
  { alias: 'api_publica_tjmsp', nome: 'TJMSP', fullName: 'TJM de São Paulo', tipo: 'Militar' },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const escritorios = await base44.entities.Escritorio.list();
    if (!escritorios?.[0]) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 400 });
    }

    const escritorioId = escritorios[0].id;

    // 1. Criar/buscar provedor DataJud
    let provedores = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: escritorioId,
      codigo_identificador: 'DATAJUD-CNJ'
    });

    let provedorId;
    if (provedores.length === 0) {
      const provedor = await base44.asServiceRole.entities.ProvedorAPI.create({
        escritorio_id: escritorioId,
        codigo_identificador: 'DATAJUD-CNJ',
        nome: 'DataJud CNJ - API Pública',
        tipo: 'REST',
        requer_autenticacao: true,
        tipo_autenticacao: 'api_key',
        base_url_v1: 'https://api-publica.datajud.cnj.jus.br',
        secret_name: 'DATAJUD_API_TOKEN',
        api_key_config: {
          secret_name: 'DATAJUD_API_TOKEN',
          header_name: 'Authorization',
          prefix: 'APIKey '
        },
        descricao: 'API pública do Conselho Nacional de Justiça para consulta de processos em todos os tribunais brasileiros',
        documentacao_url: 'https://datajud-wiki.cnj.jus.br/api-publica/endpoints',
        ativo: true
      });
      provedorId = provedor.id;
    } else {
      provedorId = provedores[0].id;
    }

    // 2. Criar endpoints para todos os tribunais
    let criados = 0;
    let atualizados = 0;
    let erros = 0;

    for (const tribunal of TODOS_TRIBUNAIS) {
      try {
        const existing = await base44.asServiceRole.entities.EndpointAPI.filter({
          escritorio_id: escritorioId,
          provedor_id: provedorId,
          path: `/${tribunal.alias}/_search`
        });

        const endpointData = {
          provedor_id: provedorId,
          escritorio_id: escritorioId,
          versao_api: 'V1',
          nome: `${tribunal.nome} - Buscar Processos`,
          descricao: `Consulta processos no ${tribunal.fullName} via DataJud CNJ`,
          categoria: `Justiça ${tribunal.tipo}`,
          metodo: 'POST',
          path: `/${tribunal.alias}/_search`,
          requer_autenticacao: true,
          parametros: [
            {
              nome: 'numeroProcesso',
              tipo: 'string',
              obrigatorio: false,
              localizacao: 'body',
              descricao: 'Número CNJ do processo (20 dígitos)',
              exemplo: '00008856582023826029'
            },
            {
              nome: 'size',
              tipo: 'number',
              obrigatorio: false,
              localizacao: 'body',
              valor_padrao: '10',
              exemplo: '10',
              descricao: 'Quantidade de resultados (max 100)'
            },
            {
              nome: 'search_after',
              tipo: 'array',
              obrigatorio: false,
              localizacao: 'body',
              descricao: 'Cursor para paginação',
              exemplo: '[1681366085550]'
            }
          ],
          exemplo_payload: {
            size: 10,
            query: { match: { numeroProcesso: '00008856582023826029' } }
          },
          documentacao_url: 'https://datajud-wiki.cnj.jus.br/api-publica/endpoints',
          ativo: true,
          tags: ['datajud', 'cnj', tribunal.tipo.toLowerCase(), tribunal.nome.toLowerCase()]
        };

        if (existing.length === 0) {
          await base44.asServiceRole.entities.EndpointAPI.create(endpointData);
          criados++;
        } else {
          await base44.asServiceRole.entities.EndpointAPI.update(existing[0].id, {
            ...endpointData,
            nome: endpointData.nome,
            descricao: endpointData.descricao,
            categoria: endpointData.categoria
          });
          atualizados++;
        }
      } catch (error) {
        console.error(`Erro ao processar ${tribunal.nome}:`, error);
        erros++;
      }
    }

    return Response.json({
      success: true,
      provedor_id: provedorId,
      criados,
      atualizados,
      erros,
      total: TODOS_TRIBUNAIS.length
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});