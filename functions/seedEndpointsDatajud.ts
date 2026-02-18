import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const ENDPOINTS_DATAJUD = [
  // Tribunais Superiores
  { tribunal: 'TST', nome: 'Tribunal Superior do Trabalho', alias: 'api_publica_tst', justice: 'Trabalho', graus: ['Superior'] },
  { tribunal: 'TSE', nome: 'Tribunal Superior Eleitoral', alias: 'api_publica_tse', justice: 'Eleitoral', graus: ['Superior'] },
  { tribunal: 'STJ', nome: 'Superior Tribunal de Justiça', alias: 'api_publica_stj', justice: 'Estadual', graus: ['Superior'] },
  { tribunal: 'STM', nome: 'Superior Tribunal Militar', alias: 'api_publica_stm', justice: 'Militar', graus: ['Superior'] },
  
  // Justiça Federal
  { tribunal: 'TRF1', nome: 'Tribunal Regional Federal da 1ª Região', alias: 'api_publica_trf1', justice: 'Federal', graus: ['G1', 'G2', 'JE'] },
  { tribunal: 'TRF2', nome: 'Tribunal Regional Federal da 2ª Região', alias: 'api_publica_trf2', justice: 'Federal', graus: ['G1', 'G2', 'JE'] },
  { tribunal: 'TRF3', nome: 'Tribunal Regional Federal da 3ª Região', alias: 'api_publica_trf3', justice: 'Federal', graus: ['G1', 'G2', 'JE'] },
  { tribunal: 'TRF4', nome: 'Tribunal Regional Federal da 4ª Região', alias: 'api_publica_trf4', justice: 'Federal', graus: ['G1', 'G2', 'JE'] },
  { tribunal: 'TRF5', nome: 'Tribunal Regional Federal da 5ª Região', alias: 'api_publica_trf5', justice: 'Federal', graus: ['G1', 'G2', 'JE'] },
  { tribunal: 'TRF6', nome: 'Tribunal Regional Federal da 6ª Região', alias: 'api_publica_trf6', justice: 'Federal', graus: ['G1', 'G2', 'JE'] },
  
  // Justiça Estadual
  { tribunal: 'TJAC', nome: 'Tribunal de Justiça do Acre', alias: 'api_publica_tjac', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJAL', nome: 'Tribunal de Justiça de Alagoas', alias: 'api_publica_tjal', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJAM', nome: 'Tribunal de Justiça do Amazonas', alias: 'api_publica_tjam', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJAP', nome: 'Tribunal de Justiça do Amapá', alias: 'api_publica_tjap', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJBA', nome: 'Tribunal de Justiça da Bahia', alias: 'api_publica_tjba', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJCE', nome: 'Tribunal de Justiça do Ceará', alias: 'api_publica_tjce', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJDFT', nome: 'Tribunal de Justiça do Distrito Federal e Territórios', alias: 'api_publica_tjdft', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJES', nome: 'Tribunal de Justiça do Espírito Santo', alias: 'api_publica_tjes', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJGO', nome: 'Tribunal de Justiça de Goiás', alias: 'api_publica_tjgo', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJMA', nome: 'Tribunal de Justiça do Maranhão', alias: 'api_publica_tjma', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJMG', nome: 'Tribunal de Justiça de Minas Gerais', alias: 'api_publica_tjmg', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJMS', nome: 'Tribunal de Justiça do Mato Grosso do Sul', alias: 'api_publica_tjms', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJMT', nome: 'Tribunal de Justiça do Mato Grosso', alias: 'api_publica_tjmt', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJPA', nome: 'Tribunal de Justiça do Pará', alias: 'api_publica_tjpa', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJPB', nome: 'Tribunal de Justiça da Paraíba', alias: 'api_publica_tjpb', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJPE', nome: 'Tribunal de Justiça de Pernambuco', alias: 'api_publica_tjpe', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJPI', nome: 'Tribunal de Justiça do Piauí', alias: 'api_publica_tjpi', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJPR', nome: 'Tribunal de Justiça do Paraná', alias: 'api_publica_tjpr', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJRJ', nome: 'Tribunal de Justiça do Rio de Janeiro', alias: 'api_publica_tjrj', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJRN', nome: 'Tribunal de Justiça do Rio Grande do Norte', alias: 'api_publica_tjrn', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJRO', nome: 'Tribunal de Justiça de Rondônia', alias: 'api_publica_tjro', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJRR', nome: 'Tribunal de Justiça de Roraima', alias: 'api_publica_tjrr', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJRS', nome: 'Tribunal de Justiça do Rio Grande do Sul', alias: 'api_publica_tjrs', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJSC', nome: 'Tribunal de Justiça de Santa Catarina', alias: 'api_publica_tjsc', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJSE', nome: 'Tribunal de Justiça de Sergipe', alias: 'api_publica_tjse', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJSP', nome: 'Tribunal de Justiça de São Paulo', alias: 'api_publica_tjsp', justice: 'Estadual', graus: ['G1', 'G2'] },
  { tribunal: 'TJTO', nome: 'Tribunal de Justiça do Tocantins', alias: 'api_publica_tjto', justice: 'Estadual', graus: ['G1', 'G2'] },
  
  // Justiça do Trabalho
  { tribunal: 'TRT1', nome: 'Tribunal Regional do Trabalho da 1ª Região', alias: 'api_publica_trt1', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT2', nome: 'Tribunal Regional do Trabalho da 2ª Região', alias: 'api_publica_trt2', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT3', nome: 'Tribunal Regional do Trabalho da 3ª Região', alias: 'api_publica_trt3', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT4', nome: 'Tribunal Regional do Trabalho da 4ª Região', alias: 'api_publica_trt4', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT5', nome: 'Tribunal Regional do Trabalho da 5ª Região', alias: 'api_publica_trt5', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT6', nome: 'Tribunal Regional do Trabalho da 6ª Região', alias: 'api_publica_trt6', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT7', nome: 'Tribunal Regional do Trabalho da 7ª Região', alias: 'api_publica_trt7', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT8', nome: 'Tribunal Regional do Trabalho da 8ª Região', alias: 'api_publica_trt8', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT9', nome: 'Tribunal Regional do Trabalho da 9ª Região', alias: 'api_publica_trt9', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT10', nome: 'Tribunal Regional do Trabalho da 10ª Região', alias: 'api_publica_trt10', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT11', nome: 'Tribunal Regional do Trabalho da 11ª Região', alias: 'api_publica_trt11', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT12', nome: 'Tribunal Regional do Trabalho da 12ª Região', alias: 'api_publica_trt12', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT13', nome: 'Tribunal Regional do Trabalho da 13ª Região', alias: 'api_publica_trt13', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT14', nome: 'Tribunal Regional do Trabalho da 14ª Região', alias: 'api_publica_trt14', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT15', nome: 'Tribunal Regional do Trabalho da 15ª Região', alias: 'api_publica_trt15', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT16', nome: 'Tribunal Regional do Trabalho da 16ª Região', alias: 'api_publica_trt16', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT17', nome: 'Tribunal Regional do Trabalho da 17ª Região', alias: 'api_publica_trt17', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT18', nome: 'Tribunal Regional do Trabalho da 18ª Região', alias: 'api_publica_trt18', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT19', nome: 'Tribunal Regional do Trabalho da 19ª Região', alias: 'api_publica_trt19', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT20', nome: 'Tribunal Regional do Trabalho da 20ª Região', alias: 'api_publica_trt20', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT21', nome: 'Tribunal Regional do Trabalho da 21ª Região', alias: 'api_publica_trt21', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT22', nome: 'Tribunal Regional do Trabalho da 22ª Região', alias: 'api_publica_trt22', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT23', nome: 'Tribunal Regional do Trabalho da 23ª Região', alias: 'api_publica_trt23', justice: 'Trabalho', graus: ['G1', 'G2'] },
  { tribunal: 'TRT24', nome: 'Tribunal Regional do Trabalho da 24ª Região', alias: 'api_publica_trt24', justice: 'Trabalho', graus: ['G1', 'G2'] },
  
  // Justiça Eleitoral
  { tribunal: 'TREAC', nome: 'Tribunal Regional Eleitoral do Acre', alias: 'api_publica_treac', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREAL', nome: 'Tribunal Regional Eleitoral de Alagoas', alias: 'api_publica_treal', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREAM', nome: 'Tribunal Regional Eleitoral do Amazonas', alias: 'api_publica_tream', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREAP', nome: 'Tribunal Regional Eleitoral do Amapá', alias: 'api_publica_treap', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREBA', nome: 'Tribunal Regional Eleitoral da Bahia', alias: 'api_publica_treba', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRECE', nome: 'Tribunal Regional Eleitoral do Ceará', alias: 'api_publica_trece', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREDFT', nome: 'Tribunal Regional Eleitoral do Distrito Federal', alias: 'api_publica_tredft', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREES', nome: 'Tribunal Regional Eleitoral do Espírito Santo', alias: 'api_publica_trees', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREGO', nome: 'Tribunal Regional Eleitoral de Goiás', alias: 'api_publica_trego', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREMA', nome: 'Tribunal Regional Eleitoral do Maranhão', alias: 'api_publica_trema', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREMG', nome: 'Tribunal Regional Eleitoral de Minas Gerais', alias: 'api_publica_tremg', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREMS', nome: 'Tribunal Regional Eleitoral do Mato Grosso do Sul', alias: 'api_publica_trems', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREMT', nome: 'Tribunal Regional Eleitoral do Mato Grosso', alias: 'api_publica_tremt', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREPA', nome: 'Tribunal Regional Eleitoral do Pará', alias: 'api_publica_trepa', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREPB', nome: 'Tribunal Regional Eleitoral da Paraíba', alias: 'api_publica_trepb', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREPE', nome: 'Tribunal Regional Eleitoral de Pernambuco', alias: 'api_publica_trepe', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREPI', nome: 'Tribunal Regional Eleitoral do Piauí', alias: 'api_publica_trepi', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TREPR', nome: 'Tribunal Regional Eleitoral do Paraná', alias: 'api_publica_trepr', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRERJ', nome: 'Tribunal Regional Eleitoral do Rio de Janeiro', alias: 'api_publica_trerj', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRERN', nome: 'Tribunal Regional Eleitoral do Rio Grande do Norte', alias: 'api_publica_trern', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRERO', nome: 'Tribunal Regional Eleitoral de Rondônia', alias: 'api_publica_trero', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRERR', nome: 'Tribunal Regional Eleitoral de Roraima', alias: 'api_publica_trerr', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRERS', nome: 'Tribunal Regional Eleitoral do Rio Grande do Sul', alias: 'api_publica_trers', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRESC', nome: 'Tribunal Regional Eleitoral de Santa Catarina', alias: 'api_publica_tresc', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRESE', nome: 'Tribunal Regional Eleitoral de Sergipe', alias: 'api_publica_trese', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRESP', nome: 'Tribunal Regional Eleitoral de São Paulo', alias: 'api_publica_tresp', justice: 'Eleitoral', graus: ['G1'] },
  { tribunal: 'TRETO', nome: 'Tribunal Regional Eleitoral do Tocantins', alias: 'api_publica_treto', justice: 'Eleitoral', graus: ['G1'] },
  
  // Justiça Militar
  { tribunal: 'TJMMG', nome: 'Tribunal de Justiça Militar de Minas Gerais', alias: 'api_publica_tjmmg', justice: 'Militar', graus: ['G1'] },
  { tribunal: 'TJMRS', nome: 'Tribunal de Justiça Militar do Rio Grande do Sul', alias: 'api_publica_tjmrs', justice: 'Militar', graus: ['G1'] },
  { tribunal: 'TJMSP', nome: 'Tribunal de Justiça Militar de São Paulo', alias: 'api_publica_tjmsp', justice: 'Militar', graus: ['G1'] }
];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    if (!escritorioId) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }

    // Buscar ou criar provedor DataJud
    let provedor = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: escritorioId,
      codigo_identificador: 'DATAJUD_CNJ'
    });

    if (!provedor || provedor.length === 0) {
      provedor = await base44.asServiceRole.entities.ProvedorAPI.create({
        escritorio_id: escritorioId,
        codigo_identificador: 'DATAJUD_CNJ',
        nome: 'DataJud CNJ - API Pública',
        tipo: 'REST',
        requer_autenticacao: true,
        tipo_autenticacao: 'api_key',
        base_url_v1: 'https://api-publica.datajud.cnj.jus.br',
        api_key_config: {
          secret_name: 'DATAJUD_API_TOKEN',
          header_name: 'Authorization',
          prefix: 'APIKey '
        },
        descricao: 'API Pública do DataJud para consulta de processos judiciais',
        documentacao_url: 'https://datajud-wiki.cnj.jus.br/api-publica',
        ativo: true
      });
    } else {
      provedor = provedor[0];
    }

    let criados = 0;
    let atualizados = 0;
    const erros = [];

    for (const endpoint of ENDPOINTS_DATAJUD) {
      try {
        const existing = await base44.asServiceRole.entities.EndpointAPI.filter({
          provedor_id: provedor.id,
          path: `/${endpoint.alias}/_search`
        });

        const endpointData = {
          provedor_id: provedor.id,
          escritorio_id: escritorioId,
          versao_api: 'V1',
          nome: `${endpoint.tribunal} - Buscar Processos`,
          descricao: `Endpoint para busca de processos no ${endpoint.nome}`,
          categoria: `DataJud - ${endpoint.justice}`,
          metodo: 'POST',
          path: `/${endpoint.alias}/_search`,
          requer_autenticacao: true,
          parametros: [
            { nome: 'numeroProcesso', tipo: 'string', obrigatorio: false, descricao: 'Número CNJ do processo (20 dígitos)', localizacao: 'body', exemplo: '00008323520184013202' },
            { nome: 'classe.codigo', tipo: 'number', obrigatorio: false, descricao: 'Código da classe processual TPU', localizacao: 'body', exemplo: '1116' },
            { nome: 'orgaoJulgador.codigo', tipo: 'number', obrigatorio: false, descricao: 'Código do órgão julgador', localizacao: 'body', exemplo: '13597' },
            { nome: 'size', tipo: 'number', obrigatorio: false, descricao: 'Número de resultados (padrão: 10, max: 10000)', localizacao: 'body', exemplo: '100', valor_padrao: '10' },
            { nome: 'search_after', tipo: 'array', obrigatorio: false, descricao: 'Paginação - timestamp do último resultado', localizacao: 'body' }
          ],
          exemplo_payload: {
            query: { match: { numeroProcesso: '00008323520184013202' } },
            size: 10
          },
          tags: ['datajud', endpoint.justice.toLowerCase(), endpoint.tribunal.toLowerCase(), ...endpoint.graus.map(g => g.toLowerCase())],
          ativo: true
        };

        if (existing && existing.length > 0) {
          await base44.asServiceRole.entities.EndpointAPI.update(existing[0].id, endpointData);
          atualizados++;
        } else {
          await base44.asServiceRole.entities.EndpointAPI.create(endpointData);
          criados++;
        }
      } catch (error) {
        erros.push({ tribunal: endpoint.tribunal, erro: error.message });
      }
    }

    return Response.json({
      success: true,
      provedor_id: provedor.id,
      total_endpoints: ENDPOINTS_DATAJUD.length,
      criados,
      atualizados,
      erros
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});