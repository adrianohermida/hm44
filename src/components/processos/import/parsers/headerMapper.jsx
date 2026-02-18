export const ALIASES_CAMPOS = {
  numero_cnj: ['processo', 'numero', 'numero_processo', 'cnj', 'num_processo', 'número do processo'],
  tribunal: ['tribunal', 'tribunal_nome', 'sigla_tribunal', 'orgao', 'órgão'],
  titulo: ['título', 'titulo', 'nome', 'descrição', 'descricao'],
  polo_ativo: ['polo ativo', 'autor', 'requerente', 'polo_ativo', 'titulo_polo_ativo'],
  polo_passivo: ['polo passivo', 'reu', 'réu', 'requerido', 'polo_passivo', 'titulo_polo_passivo'],
  data_distribuicao: ['data de distribuição', 'data de distribuicao', 'data_distribuicao', 'data distribuição'],
  valor_causa: ['valor da causa', 'valor_causa', 'valor'],
  classe: ['classe', 'classe processual'],
  assunto: ['assunto', 'assunto principal'],
  area: ['área', 'area'],
  orgao_julgador: ['órgão julgador', 'orgao julgador'],
  instancia: ['instância', 'instancia', 'grau'],
  status: ['status', 'situação', 'situacao', 'arquivado']
};

export const MODELOS = {
  tecnico: {
    keywords: ['escritorio_id', 'numero_cnj', 'cliente_id', 'dados_completos_api'],
    score_threshold: 3
  },
  juridico: {
    keywords: ['Processo', 'Tribunal', 'Polo Ativo', 'Polo Passivo'],
    score_threshold: 3
  },
  crm: {
    keywords: ['Pipeline', 'Associated Contact', 'numero_processo'],
    score_threshold: 2
  },
  hibrido: {
    keywords: ['Título', 'Apensos', 'IDs'],
    score_threshold: 2
  }
};

export function normalizar(texto) {
  return texto.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
}

export function detectarModelo(headers) {
  const scores = Object.entries(MODELOS).map(([modelo, config]) => {
    const matches = config.keywords.filter(keyword =>
      headers.some(h => normalizar(h).includes(normalizar(keyword)))
    );
    return { modelo, score: matches.length, threshold: config.score_threshold };
  });

  const melhor = scores.sort((a, b) => b.score - a.score)[0];
  return melhor.score >= melhor.threshold ? melhor.modelo : 'desconhecido';
}

export function mapearHeaders(headers) {
  const mapeamento = {};
  
  headers.forEach(header => {
    const headerNorm = normalizar(header);
    
    for (const [campoSchema, aliases] of Object.entries(ALIASES_CAMPOS)) {
      if (aliases.some(alias => headerNorm.includes(normalizar(alias)))) {
        mapeamento[header] = campoSchema;
        return;
      }
    }
    
    mapeamento[header] = headerNorm.replace(/\s+/g, '_');
  });

  return mapeamento;
}