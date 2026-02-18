import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Extrai INSERT statements de arquivo PostgreSQL (multi-line support)
function extrairInserts(conteudoSQL) {
  const matches = [];
  
  // Remove comentários SQL
  let sql = conteudoSQL.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Regex robusta para multi-line INSERTs
  const insertRegex = /INSERT\s+INTO\s+[^\(]+\(([^\)]+)\)\s+VALUES\s*\(([^;]+)\);/gis;
  let match;

  while ((match = insertRegex.exec(sql)) !== null) {
    try {
      const camposStr = match[1];
      const valoresStr = match[2];
      
      // Parse campos (remove quotes e trim)
      const campos = camposStr.split(',').map(c => 
        c.trim().replace(/^["']|["']$/g, '')
      );
      
      // Parse valores com suporte a strings com vírgulas
      const valores = parseValores(valoresStr);
      
      if (campos.length !== valores.length) {
        console.warn(`Campo/valor mismatch: ${campos.length} campos, ${valores.length} valores`);
        continue;
      }
      
      const obj = {};
      campos.forEach((campo, idx) => {
        obj[campo] = valores[idx];
      });
      matches.push(obj);
    } catch (error) {
      console.error('Erro ao processar INSERT:', error.message);
    }
  }

  return matches;
}

// Parser robusto de valores SQL
function parseValores(valoresStr) {
  const valores = [];
  let atual = '';
  let dentroString = false;
  let stringChar = null;
  let profundidadeParenteses = 0;
  
  for (let i = 0; i < valoresStr.length; i++) {
    const char = valoresStr[i];
    const proxChar = valoresStr[i + 1];
    
    // Detecta início/fim de string
    if ((char === "'" || char === '"') && (i === 0 || valoresStr[i - 1] !== '\\')) {
      if (!dentroString) {
        dentroString = true;
        stringChar = char;
        atual += char;
      } else if (char === stringChar) {
        // Verifica se é escape de aspas ('')
        if (proxChar === char) {
          atual += char + char;
          i++; // Skip próximo
        } else {
          dentroString = false;
          stringChar = null;
          atual += char;
        }
      } else {
        atual += char;
      }
      continue;
    }
    
    // Dentro de string, adiciona tudo
    if (dentroString) {
      atual += char;
      continue;
    }
    
    // Rastreia parênteses (para arrays/JSON)
    if (char === '(') profundidadeParenteses++;
    if (char === ')') profundidadeParenteses--;
    
    // Vírgula fora de string e parênteses = separador
    if (char === ',' && profundidadeParenteses === 0) {
      valores.push(processarValor(atual.trim()));
      atual = '';
      continue;
    }
    
    atual += char;
  }
  
  // Adiciona último valor
  if (atual.trim()) {
    valores.push(processarValor(atual.trim()));
  }
  
  return valores;
}

// Processa valor individual
function processarValor(valor) {
  // NULL
  if (valor.toUpperCase() === 'NULL') return null;
  
  // String entre aspas
  if ((valor.startsWith("'") && valor.endsWith("'")) || 
      (valor.startsWith('"') && valor.endsWith('"'))) {
    return valor.slice(1, -1).replace(/''/g, "'").replace(/\\'/g, "'");
  }
  
  // Booleano
  if (valor.toLowerCase() === 'true') return true;
  if (valor.toLowerCase() === 'false') return false;
  
  // Número
  if (!isNaN(valor) && valor !== '') {
    return valor.includes('.') ? parseFloat(valor) : parseInt(valor);
  }
  
  // Default: retorna string
  return valor;
}

// Mapeia campos PostgreSQL para schema Base44 (CNJ oficial)
function mapearCampos(obj, tipoTabela) {
  switch (tipoTabela) {
    case 'movimentos':
      return {
        codigo: (obj.cod_movimento || obj.cod_movimento_processual || obj.cod_item)?.toString(),
        codigo_pai: (obj.cod_movimento_pai || obj.cod_item_pai)?.toString(),
        nivel1: obj.nivel1,
        nivel2: obj.nivel2,
        nivel3: obj.nivel3,
        nivel4: obj.nivel4,
        nivel5: obj.nivel5,
        nivel6: obj.nivel6,
        glossario: obj.glossario || obj.txt_glossario,
        dispositivo_legal: obj.dispositivo_legal,
        artigo: obj.artigo,
        sigla: obj.sigla,
        tipo_item: obj.tipo_item,
        situacao: obj.situacao,
        dat_versao: obj.dat_versao,
        dat_inativacao: obj.dat_inativacao,
        dat_inicio_vigencia: obj.dat_inicio_vigencia,
        dat_fim_vigencia: obj.dat_fim_vigencia,
        ativo: obj.situacao === 'A' || !obj.dat_inativacao
      };

    case 'classes':
      return {
        codigo: (obj.cod_classe || obj.cod_item)?.toString(),
        codigo_pai: (obj.cod_classe_pai || obj.cod_item_pai)?.toString(),
        nivel1: obj.nivel1,
        nivel2: obj.nivel2,
        nivel3: obj.nivel3,
        nivel4: obj.nivel4,
        nivel5: obj.nivel5,
        nivel6: obj.nivel6,
        natureza: obj.natureza,
        dispositivo_legal: obj.dispositivo_legal,
        artigo: obj.artigo,
        sigla: obj.sigla,
        sigla_antiga: obj.sigla_antiga,
        polo_ativo: obj.polo_ativo,
        polo_passivo: obj.polo_passivo,
        glossario: obj.glossario || obj.txt_glossario,
        numeracao_propria: obj.numeracao_propria,
        just_es_1grau: obj.just_es_1grau,
        just_es_2grau: obj.just_es_2grau,
        just_fed_1grau: obj.just_fed_1grau,
        just_fed_2grau: obj.just_fed_2grau,
        just_trab_1grau: obj.just_trab_1grau,
        just_trab_2grau: obj.just_trab_2grau,
        stf: obj.stf,
        stj: obj.stj,
        cnj: obj.cnj,
        tipo_item: obj.tipo_item,
        situacao: obj.situacao,
        dat_versao: obj.dat_versao,
        dat_inativacao: obj.dat_inativacao,
        ativo: obj.situacao === 'A' || !obj.dat_inativacao
      };

    case 'assuntos':
      return {
        codigo: (obj.cod_assunto || obj.cod_item)?.toString(),
        codigo_pai: (obj.cod_assunto_pai || obj.cod_item_pai)?.toString(),
        nivel1: obj.nivel1,
        nivel2: obj.nivel2,
        nivel3: obj.nivel3,
        nivel4: obj.nivel4,
        nivel5: obj.nivel5,
        nivel6: obj.nivel6,
        dispositivo_legal: obj.dispositivo_legal,
        artigo: obj.artigo,
        glossario: obj.glossario || obj.txt_glossario,
        sigiloso: obj.sigiloso,
        assunto_secundario: obj.assunto_secundario,
        crime_antecedente: obj.crime_antecedente,
        just_es_1grau: obj.just_es_1grau,
        just_es_2grau: obj.just_es_2grau,
        just_fed_1grau: obj.just_fed_1grau,
        just_fed_2grau: obj.just_fed_2grau,
        just_trab_1grau: obj.just_trab_1grau,
        just_trab_2grau: obj.just_trab_2grau,
        stf: obj.stf,
        stj: obj.stj,
        cnj: obj.cnj,
        tipo_item: obj.tipo_item,
        situacao: obj.situacao,
        dat_versao: obj.dat_versao,
        dat_inativacao: obj.dat_inativacao,
        ativo: obj.situacao === 'A' || !obj.dat_inativacao
      };

    case 'documentos':
      return {
        cod_documento_processual: obj.cod_documento_processual?.toString(),
        txt_glossario: obj.txt_glossario || obj.glossario,
        nome: obj.nome || obj.nivel1 || obj.txt_glossario,
        tipo_item: obj.tipo_item,
        situacao: obj.situacao,
        dat_inativacao: obj.dat_inativacao,
        ativo: obj.situacao === 'A' || !obj.dat_inativacao
      };

    default:
      return obj;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { file_url, tipo_tabela, nome_arquivo } = await req.json();

    if (!file_url || !tipo_tabela) {
      return Response.json({ 
        success: false, 
        erro: 'Parâmetros obrigatórios: file_url, tipo_tabela' 
      }, { status: 400 });
    }

    // Buscar conteúdo do arquivo da nuvem
    const fileResponse = await fetch(file_url);
    if (!fileResponse.ok) {
      return Response.json({ 
        success: false, 
        erro: 'Erro ao baixar arquivo da nuvem' 
      }, { status: 500 });
    }
    
    const conteudo_sql = await fileResponse.text();

    const entidades = {
      movimentos: 'TabelaMovimentoCNJ',
      classes: 'TabelaClasseCNJ',
      assuntos: 'TabelaAssuntoCNJ',
      documentos: 'DocumentoPublico'
    };

    const entityName = entidades[tipo_tabela];
    if (!entityName) {
      return Response.json({ 
        success: false, 
        erro: 'Tipo de tabela inválido' 
      }, { status: 400 });
    }

    // Extrai INSERT statements
    const inserts = extrairInserts(conteudo_sql);

    if (inserts.length === 0) {
      return Response.json({ 
        success: false, 
        erro: 'Nenhum INSERT encontrado no arquivo',
        debug: {
          tamanho_arquivo: conteudo_sql.length,
          primeiros_chars: conteudo_sql.substring(0, 200),
          contem_insert: conteudo_sql.toLowerCase().includes('insert into')
        }
      });
    }

    // Mapeia para schema Base44
    const dados = inserts.map(obj => mapearCampos(obj, tipo_tabela));

    // Importa em lote
    let inseridos = 0;
    let atualizados = 0;
    let erros = 0;

    const batchSize = 100;
    for (let i = 0; i < dados.length; i += batchSize) {
      const batch = dados.slice(i, i + batchSize);
      
      try {
        await base44.asServiceRole.entities[entityName].bulkCreate(batch);
        inseridos += batch.length;
      } catch (error) {
        erros += batch.length;
        console.error(`Erro no batch ${i}: ${error.message}`);
      }
    }

    return Response.json({
      success: true,
      inseridos,
      atualizados,
      erros,
      total_processados: dados.length,
      arquivo: nome_arquivo
    });

  } catch (error) {
    return Response.json({ 
      success: false, 
      erro: error.message 
    }, { status: 500 });
  }
});