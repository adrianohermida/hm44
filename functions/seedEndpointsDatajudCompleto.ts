import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const ENDPOINTS_DATAJUD = [
  {
    nome: 'Busca por Número de Processo',
    alias: 'api_publica_[TRIBUNAL]',
    categoria: 'Busca Básica',
    descricao: 'Consulta processo pelo número CNJ de 20 dígitos',
    exemplo_payload: {
      query: { match: { numeroProcesso: "00008856582023826029" } },
      size: 10
    },
    parametros: [
      { 
        nome: 'numeroProcesso', 
        tipo: 'string', 
        obrigatorio: true, 
        localizacao: 'body', 
        exemplo: '00008856582023826029', 
        descricao: 'Número CNJ do processo (20 dígitos sem formatação)'
      },
      { 
        nome: 'size', 
        tipo: 'number', 
        obrigatorio: false, 
        localizacao: 'body', 
        exemplo: '10', 
        valor_padrao: '10',
        descricao: 'Número de resultados (padrão: 10, max: 10000)'
      },
      { 
        nome: 'search_after', 
        tipo: 'string', 
        obrigatorio: false, 
        localizacao: 'body', 
        exemplo: '', 
        descricao: 'Paginação - timestamp do último resultado'
      }
    ]
  },
  {
    nome: 'Busca por Classe e Órgão Julgador',
    alias: 'api_publica_[TRIBUNAL]',
    categoria: 'Busca Combinada',
    descricao: 'Filtra processos por classe processual e órgão julgador',
    exemplo_payload: {
      query: {
        bool: {
          must: [
            { match: { "classe.codigo": 1116 } },
            { match: { "orgaoJulgador.codigo": 13597 } }
          ]
        }
      },
      size: 100
    },
    parametros: [
      { nome: 'classe.codigo', tipo: 'string', obrigatorio: false, localizacao: 'body', exemplo: '1116', descricao: 'Código da classe processual TPU' },
      { nome: 'orgaoJulgador.codigo', tipo: 'string', obrigatorio: false, localizacao: 'body', exemplo: '13597', descricao: 'Código do órgão julgador' },
      { nome: 'size', tipo: 'number', obrigatorio: false, localizacao: 'body', exemplo: '100', valor_padrao: '10', descricao: 'Número de resultados' }
    ]
  },
  {
    nome: 'Busca por Assunto',
    alias: 'api_publica_[TRIBUNAL]',
    categoria: 'Busca Temática',
    descricao: 'Filtra processos por assunto da TPU CNJ',
    exemplo_payload: {
      query: { match: { "assuntos.codigo": 5003 } },
      size: 50
    },
    parametros: [
      { nome: 'assuntos.codigo', tipo: 'number', obrigatorio: true, localizacao: 'body', exemplo: '5003', descricao: 'Código do assunto (Ex: 5003 = Contratos Bancários)' }
    ]
  },
  {
    nome: 'Busca por Intervalo de Datas',
    alias: 'api_publica_[TRIBUNAL]',
    categoria: 'Busca Temporal',
    descricao: 'Filtra processos distribuídos em período específico',
    exemplo_payload: {
      query: {
        range: {
          dataAjuizamento: {
            gte: "2023-01-01",
            lte: "2023-12-31"
          }
        }
      },
      size: 100
    },
    parametros: [
      { nome: 'dataAjuizamento.gte', tipo: 'string', formato: 'date', obrigatorio: false, localizacao: 'body', exemplo: '2023-01-01' },
      { nome: 'dataAjuizamento.lte', tipo: 'string', formato: 'date', obrigatorio: false, localizacao: 'body', exemplo: '2023-12-31' }
    ]
  },
  {
    nome: 'Busca por Nome de Parte',
    alias: 'api_publica_[TRIBUNAL]',
    categoria: 'Busca por Envolvidos',
    descricao: 'Localiza processos contendo nome específico nas partes',
    exemplo_payload: {
      query: {
        multi_match: {
          query: "João da Silva",
          fields: ["movimentos.partes.nome", "envolvidos.nome"],
          type: "phrase_prefix"
        }
      },
      size: 20
    },
    parametros: [
      { nome: 'parteNome', tipo: 'string', obrigatorio: true, localizacao: 'body', exemplo: 'João da Silva', descricao: 'Nome da parte (autor, réu, etc)' }
    ]
  },
  {
    nome: 'Busca por Nome de Advogado',
    alias: 'api_publica_[TRIBUNAL]',
    categoria: 'Busca por Envolvidos',
    descricao: 'Localiza processos onde advogado específico atua',
    exemplo_payload: {
      query: {
        match: { "movimentos.partes.advogados.nome": "Dr. Maria Santos" }
      },
      size: 20
    },
    parametros: [
      { nome: 'advogadoNome', tipo: 'string', obrigatorio: true, localizacao: 'body', exemplo: 'Dr. Maria Santos' }
    ]
  },
  {
    nome: 'Paginação com search_after',
    alias: 'api_publica_[TRIBUNAL]',
    categoria: 'Paginação',
    descricao: 'Recupera resultados paginados usando cursor',
    exemplo_payload: {
      query: { match_all: {} },
      size: 100,
      search_after: [1681366085550],
      sort: [{ "@timestamp": { order: "asc" } }]
    },
    parametros: [
      { nome: 'search_after', tipo: 'array', obrigatorio: false, localizacao: 'body', exemplo: '[1681366085550]', descricao: 'Valor de sort do último resultado da página anterior' }
    ]
  }
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
    let criados = 0;
    let atualizados = 0;

    for (const endpoint of ENDPOINTS_DATAJUD) {
      const existing = await base44.asServiceRole.entities.EndpointAPI.filter({
        escritorio_id: escritorioId,
        nome: endpoint.nome,
        categoria: endpoint.categoria
      });

      if (existing.length === 0) {
        await base44.asServiceRole.entities.EndpointAPI.create({
          provedor_id: 'datajud_cnj',
          escritorio_id: escritorioId,
          versao_api: 'V1',
          nome: endpoint.nome,
          descricao: endpoint.descricao,
          categoria: endpoint.categoria,
          metodo: 'POST',
          path: '/_search',
          parametros: endpoint.parametros,
          exemplo_payload: endpoint.exemplo_payload,
          documentacao_url: 'https://datajud.cnj.jus.br/api-publica',
          ativo: true,
          tags: ['datajud', 'cnj', 'processos']
        });
        criados++;
      } else {
        await base44.asServiceRole.entities.EndpointAPI.update(existing[0].id, {
          exemplo_payload: endpoint.exemplo_payload,
          parametros: endpoint.parametros,
          descricao: endpoint.descricao
        });
        atualizados++;
      }
    }

    return Response.json({
      success: true,
      criados,
      atualizados,
      total: ENDPOINTS_DATAJUD.length
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});