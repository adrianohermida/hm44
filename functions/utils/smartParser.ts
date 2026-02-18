// Auto-detecção de modelo e mapeamento inteligente de headers
export class SmartParser {
  static MODELOS = {
    tecnico: {
      keywords: ['escritorio_id', 'numero_cnj', 'cliente_id', 'dados_completos_api'],
      score_threshold: 3
    },
    juridico: {
      keywords: ['Processo', 'Tribunal', 'Polo Ativo', 'Polo Passivo', 'Órgão julgador'],
      score_threshold: 3
    },
    crm: {
      keywords: ['Pipeline', 'Associated Contact', 'Associated Deal', 'ID do registro'],
      score_threshold: 2
    },
    hibrido: {
      keywords: ['Título', 'Apensos', 'IDs', 'Outras Partes'],
      score_threshold: 2
    }
  };

  static ALIASES_CAMPOS = {
    numero_cnj: ['processo', 'numero', 'numero_processo', 'cnj', 'num_processo', 'número do processo'],
    tribunal: ['tribunal', 'tribunal_nome', 'sigla_tribunal', 'orgao', 'órgão'],
    titulo: ['título', 'titulo', 'nome', 'descrição', 'descricao'],
    polo_ativo: ['polo ativo', 'autor', 'requerente', 'polo_ativo', 'titulo_polo_ativo'],
    polo_passivo: ['polo passivo', 'reu', 'réu', 'requerido', 'polo_passivo', 'titulo_polo_passivo'],
    data_distribuicao: ['data de distribuição', 'data de distribuicao', 'data_distribuicao', 'data distribuição', 'distribuição'],
    valor_causa: ['valor da causa', 'valor_causa', 'valor'],
    classe: ['classe', 'classe processual'],
    assunto: ['assunto', 'assunto principal', 'assunto_principal'],
    area: ['área', 'area'],
    orgao_julgador: ['órgão julgador', 'orgao julgador', 'orgão_julgador', 'orgao_julgador'],
    instancia: ['instância', 'instancia', 'grau'],
    sistema: ['sistema', 'sistema processual'],
    status: ['status', 'situação', 'situacao', 'arquivado'],
    observacoes: ['observações', 'observacoes', 'notas', 'obs']
  };

  static detectarModelo(headers) {
    const scores = Object.entries(this.MODELOS).map(([modelo, config]) => {
      const matches = config.keywords.filter(keyword =>
        headers.some(h => this.normalizar(h).includes(this.normalizar(keyword)))
      );
      return { modelo, score: matches.length, threshold: config.score_threshold };
    });

    const melhor = scores.sort((a, b) => b.score - a.score)[0];
    return melhor.score >= melhor.threshold ? melhor.modelo : 'desconhecido';
  }

  static mapearHeaders(headers) {
    const mapeamento = {};
    
    headers.forEach(header => {
      const headerNorm = this.normalizar(header);
      
      for (const [campoSchema, aliases] of Object.entries(this.ALIASES_CAMPOS)) {
        if (aliases.some(alias => headerNorm.includes(this.normalizar(alias)))) {
          mapeamento[header] = campoSchema;
          return;
        }
      }
      
      mapeamento[header] = this.normalizar(header).replace(/\s+/g, '_');
    });

    return mapeamento;
  }

  static normalizar(texto) {
    return texto.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .trim();
  }

  static limparCNJ(valor) {
    if (!valor) return null;
    
    // Remove TUDO que não seja número
    const limpo = String(valor).replace(/[^0-9]/g, '');
    
    // OBRIGATÓRIO: exatamente 20 dígitos
    if (limpo.length !== 20) return null;
    
    // Validação básica CNJ (dígito verificador)
    const dv = limpo.substring(7, 9);
    if (dv === '00' || parseInt(dv) > 99) return null;
    
    return limpo;
  }

  static normalizarTribunal(tribunal) {
    if (!tribunal) return null;
    
    const mapaTribunais = {
      'TJSP': ['tjsp', 'tj-sp', 'tj sp', 'tribunal de justiça de são paulo', 'tribunal de justica de sao paulo'],
      'TJRJ': ['tjrj', 'tj-rj', 'tj rj', 'tribunal de justiça do rio de janeiro'],
      'TJMG': ['tjmg', 'tj-mg', 'tj mg', 'tribunal de justiça de minas gerais'],
      'STJ': ['stj', 'superior tribunal de justiça'],
      'TST': ['tst', 'tribunal superior do trabalho'],
      'TRF1': ['trf1', 'trf-1', 'trf 1'],
      'TRF2': ['trf2', 'trf-2', 'trf 2'],
      'TRF3': ['trf3', 'trf-3', 'trf 3']
    };

    const tribunalNorm = this.normalizar(tribunal);
    
    for (const [sigla, variantes] of Object.entries(mapaTribunais)) {
      if (variantes.some(v => tribunalNorm.includes(v))) return sigla;
    }

    return tribunal.substring(0, 10);
  }

  static mapearStatus(valor) {
    if (!valor) return 'ativo';
    const norm = this.normalizar(String(valor));
    
    if (['true', 'sim', 'yes', '1', 'arquivado'].some(v => norm === v)) return 'arquivado';
    if (['false', 'nao', 'não', 'no', '0', 'ativo'].some(v => norm === v)) return 'ativo';
    if (norm.includes('suspen')) return 'suspenso';
    
    return 'ativo';
  }

  static parseData(valor) {
    if (!valor) return null;
    
    try {
      // Formato DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
        const [dia, mes, ano] = valor.split('/');
        return `${ano}-${mes}-${dia}`;
      }
      
      // Formato ISO ou Date object
      const date = new Date(valor);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {}
    
    return null;
  }

  static parseValor(valor) {
    if (!valor) return null;
    const limpo = String(valor).replace(/[^\d.,]/g, '').replace(',', '.');
    const numero = parseFloat(limpo);
    return isNaN(numero) ? null : limpo;
  }

  static parseRelacional(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return [];
  }

  static gerarTituloAuto(row) {
    const ativo = row.polo_ativo || row['Polo Ativo'] || row.autor || 'Parte Ativa';
    const passivo = row.polo_passivo || row['Polo Passivo'] || row.reu || 'Parte Passiva';
    return `${ativo} x ${passivo}`;
  }

  static toPascalCase(campo) {
    return campo.split('_').map(p => 
      p.charAt(0).toUpperCase() + p.slice(1)
    ).join(' ');
  }

  static parse(row, modelo, escritorioId) {
    const mapped = {};

    mapped.escritorio_id = row.escritorio_id || escritorioId;
    mapped.numero_cnj = this.limparCNJ(row.numero_cnj || row.Processo || row.numero_processo);

    if (!mapped.numero_cnj || mapped.numero_cnj.length !== 20) {
      throw new Error(`CNJ inválido: ${mapped.numero_cnj}`);
    }

    mapped.titulo = row.titulo || row.Título || this.gerarTituloAuto(row);
    mapped.tribunal = this.normalizarTribunal(row.Tribunal || row.tribunal);
    mapped.status = this.mapearStatus(row.status || row.Status || row.Arquivado);
    mapped.valor_causa = this.parseValor(row.valor_causa || row['Valor da causa']);
    mapped.polo_ativo = row.polo_ativo || row['Polo Ativo'];
    mapped.polo_passivo = row.polo_passivo || row['Polo Passivo'];
    mapped.classe = row.classe || row.Classe;
    mapped.assunto = row.assunto || row.Assunto;

    mapped.movimentacoes = this.parseRelacional(row.movimentacoes);
    mapped.audiencias = this.parseRelacional(row.audiencias);

    const CAMPOS_DATA = ['data_distribuicao', 'data_ultima_movimentacao', 'data_inicio'];
    CAMPOS_DATA.forEach(campo => {
      const rawDate = row[campo] || row[this.toPascalCase(campo)];
      if (rawDate) mapped[campo] = this.parseData(rawDate);
    });

    return mapped;
  }
}