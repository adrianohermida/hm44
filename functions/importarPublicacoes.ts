import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { csv_content, escritorio_id, calcular_prazos, usar_ia, enriquecer_cnj } = await req.json();
    
    if (!escritorio_id) {
      return Response.json({ error: 'escritorio_id obrigatório' }, { status: 400 });
    }

    if (!csv_content || csv_content.trim().length === 0) {
      return Response.json({ error: 'CSV vazio' }, { status: 400 });
    }

    // Parse CSV
    const lines = csv_content.split('\n').filter(l => l.trim());
    const delimiter = csv_content.includes(';') ? ';' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim());
    
    const stats = {
      importadas: 0,
      processos_criados: 0,
      processos_vinculados: 0,
      prazos_criados: 0,
      erros: []
    };

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i], delimiter);
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx]?.trim() || '';
        });

        // Parse CNJ
        const numero_cnj = row.PROCESSO?.replace(/\D/g, '');
        if (!numero_cnj || numero_cnj.length !== 20) {
          stats.erros.push({ linha: i + 1, erro: 'CNJ inválido' });
          continue;
        }

        // Enriquecer CNJ com tabelas (se habilitado)
        let dadosEnriquecidos = null;
        if (enriquecer_cnj) {
          try {
            dadosEnriquecidos = await enrichCNJFromTables(numero_cnj, base44);
          } catch (err) {
            console.error('Erro ao enriquecer CNJ:', err);
          }
        }

        // Buscar ou criar processo (multi-tenant)
        let processo = await base44.asServiceRole.entities.Processo.filter({ 
          id: numero_cnj,
          escritorio_id
        });

        if (!processo || processo.length === 0) {
          // Extrair partes do conteúdo
          const partes = extrairPartes(row.CONTEUDO || '');
          const tribunal = extrairTribunal(numero_cnj);

          await base44.asServiceRole.entities.Processo.create({
            id: numero_cnj,
            escritorio_id,
            numero_cnj,
            tribunal: dadosEnriquecidos?.tribunal_sigla || tribunal || row.DIÁRIO,
            instancia: dadosEnriquecidos?.serventia?.nome || row.VARA || null,
            polo_ativo: partes.ativo,
            polo_passivo: partes.passivo,
            fonte_origem: 'IMPORTACAO_PUBLICACAO',
            status: 'ativo',
            sistema: dadosEnriquecidos?.juizo?.sistema_processual,
            orgao_julgador: dadosEnriquecidos?.serventia?.nome,
            observacoes: dadosEnriquecidos?.enriquecido 
              ? `Enriquecido via ${dadosEnriquecidos.fonte_enriquecimento}` 
              : null
          });
          
          stats.processos_criados++;
        } else {
          stats.processos_vinculados++;
        }

        // Criar publicação
        const data_publicacao = parseDate(row['PUBLICAÇÃO EM']);
        const data_disponibilizacao = parseDate(row['DISPONIBILIZAÇÃO EM']);
        const prazoDias = calcularPrazoDias(row.CONTEUDO || '');
        const dataLimite = calcularDataLimite(data_disponibilizacao, prazoDias);

        const publicacao = await base44.asServiceRole.entities.PublicacaoProcesso.create({
          escritorio_id,
          processo_id: numero_cnj,
          data: data_publicacao || data_disponibilizacao || new Date().toISOString().split('T')[0],
          fonte: row.DIÁRIO || row.CADERNO,
          tipo: detectarTipo(row.CONTEUDO || row.DESPACHO),
          conteudo: row.CONTEUDO || row.DESPACHO || '',
          prazo_dias: prazoDias,
          data_limite: dataLimite,
          lida: false,
          prazo_calculado: false,
          origem_api: {
            comarca: row.COMARCA,
            vara: row.VARA,
            caderno: row.CADERNO,
            pagina_inicial: row['PÁGINA INICIAL'],
            pagina_final: row['PÁGINA FINAL'],
            palavra_chave: row['PALAVRA CHAVE']
          }
        });

        stats.importadas++;

        // Criar prazo se solicitado
        if (calcular_prazos && dataLimite && prazoDias > 0) {
          const prazo = await base44.asServiceRole.entities.Prazo.create({
            escritorio_id,
            processo_id: numero_cnj,
            publicacao_id: publicacao.id,
            titulo: `Prazo: ${row.PROCESSO}`,
            tipo: detectarTipoPrazo(row.CONTEUDO || ''),
            data_publicacao: data_disponibilizacao,
            data_vencimento: dataLimite,
            prazo_dias: prazoDias,
            dias_corridos: false,
            origem_calculo: usar_ia ? 'ia' : 'regra',
            confianca_ia: usar_ia ? 75 : null,
            requer_aprovacao: usar_ia && prazoDias >= 15,
            status: 'pendente'
          });

          // Atualizar publicação com prazo_id
          await base44.asServiceRole.entities.PublicacaoProcesso.update(publicacao.id, {
            prazo_id: prazo.id,
            prazo_calculado: true,
            gera_prazo: true
          });

          stats.prazos_criados++;
        }

      } catch (error) {
        stats.erros.push({ 
          linha: i + 1, 
          erro: error.message 
        });
      }
    }

    return Response.json({
      success: true,
      ...stats
    });

  } catch (error) {
    console.error('Erro em importarPublicacoes:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});

function parseCSVLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(v => v.replace(/^"|"$/g, ''));
}

function extrairPartes(conteudo) {
  const partes = { ativo: null, passivo: null };
  
  const regexPartes = /Parte\(s\):\s*(.+?)(?=Advogado|$)/i;
  const match = conteudo.match(regexPartes);
  
  if (match) {
    const texto = match[1];
    const nomes = texto.split(/,\s*\d+\.\s*/).filter(n => n.trim());
    
    nomes.forEach(nome => {
      const clean = nome.replace(/\(.*?\)/g, '').trim();
      if (clean) {
        if (!partes.ativo) {
          partes.ativo = clean;
        } else if (!partes.passivo) {
          partes.passivo = clean;
        }
      }
    });
  }
  
  return partes;
}

function extrairTribunal(cnj) {
  if (cnj.length !== 20) return null;
  
  const segmento = cnj.substring(13, 14);
  const tribunal = cnj.substring(14, 16);
  
  const tribunais = {
    '8': {
      '26': 'TJSP',
      '04': 'TJRS',
      '01': 'TJRJ',
      '02': 'TJMG'
    },
    '4': 'TRF',
    '5': 'TRT'
  };
  
  if (segmento === '8') {
    return tribunais['8'][tribunal] || `TJ-${tribunal}`;
  }
  
  return tribunais[segmento] || 'TRIBUNAL';
}

function detectarTipo(conteudo) {
  const lower = conteudo.toLowerCase();
  
  if (lower.includes('intimação')) return 'intimacao';
  if (lower.includes('sentença')) return 'sentenca';
  if (lower.includes('despacho')) return 'despacho';
  if (lower.includes('acórdão') || lower.includes('acordao')) return 'acordao';
  
  return 'outro';
}

function calcularPrazoDias(conteudo) {
  const lower = conteudo.toLowerCase();
  
  if (lower.includes('5 dias') || lower.includes('cinco dias')) return 5;
  if (lower.includes('10 dias') || lower.includes('dez dias')) return 10;
  if (lower.includes('15 dias') || lower.includes('quinze dias')) return 15;
  if (lower.includes('30 dias') || lower.includes('trinta dias')) return 30;
  
  return 5; // Prazo padrão
}

function calcularDataLimite(dataBase, dias) {
  if (!dataBase) return null;
  
  const date = new Date(dataBase);
  date.setDate(date.getDate() + dias);
  
  return date.toISOString().split('T')[0];
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // DD/MM/YYYY
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  
  return null;
}

function detectarTipoPrazo(conteudo) {
  const lower = conteudo.toLowerCase();
  
  if (lower.includes('contestação') || lower.includes('contestacao')) return 'contestacao';
  if (lower.includes('recurso')) return 'recurso';
  if (lower.includes('manifestação') || lower.includes('manifestacao')) return 'manifestacao';
  if (lower.includes('petição') || lower.includes('peticao')) return 'peticao';
  if (lower.includes('cumprimento')) return 'cumprimento';
  
  return 'outro';
}

/**
 * Enriquece CNJ com dados das tabelas ServentiaCNJ e JuizoCNJ
 */
async function enrichCNJFromTables(cnj, base44Client) {
  const digits = cnj.replace(/\D/g, '');
  if (digits.length !== 20) return null;

  const j = digits.slice(13, 14);
  const tr = digits.slice(14, 16);
  const oooo = digits.slice(16, 20);
  
  const tribunalCode = j + tr;
  
  // Mapeamento de códigos para siglas
  const tribunalMap = {
    '826': 'TJSP',
    '819': 'TJRJ',
    '813': 'TJMG',
    '821': 'TJRS',
    '807': 'TJDFT',
    '401': 'TRF1',
    '402': 'TRF2',
    '403': 'TRF3'
  };
  
  const tribunalSigla = tribunalMap[tribunalCode] || null;
  
  if (!tribunalSigla) return null;

  // Buscar serventia
  const serventias = await base44Client.asServiceRole.entities.ServentiaCNJ.filter({
    numero_serventia: oooo,
    tribunal: tribunalSigla
  });

  const serventia = serventias[0] || null;

  // Buscar juízo
  const juizos = await base44Client.asServiceRole.entities.JuizoCNJ.filter({
    tribunal: tribunalSigla,
    numero_serventia: oooo
  });

  const juizo = juizos[0] || null;

  return {
    tribunal_sigla: tribunalSigla,
    serventia: serventia ? {
      nome: serventia.nome_serventia,
      municipio: serventia.municipio,
      tipo_orgao: serventia.tipo_orgao,
      telefone: serventia.telefone,
      email: serventia.email
    } : null,
    juizo: juizo ? {
      sistema_processual: juizo.sistema_processual,
      digital_100: juizo.juizo_100_digital,
      tipo_unidade: juizo.tipo_unidade
    } : null,
    enriquecido: !!(serventia || juizo),
    fonte_enriquecimento: serventia ? 'ServentiaCNJ' : juizo ? 'JuizoCNJ' : null
  };
}