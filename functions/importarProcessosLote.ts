import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, dados, batchSize = 50, startIndex = 0, escritorioId, ignorarErros = false } = await req.json();

    // FASE 1: VALIDAR
    if (action === 'validate') {
      const erros = [];
      const avisos = [];
      
      dados.forEach((row, index) => {
        // EXTRAÇÃO INTELIGENTE: tentar extrair numero_cnj de diferentes campos
        if (!row.numero_cnj) {
          // Tentar extrair de dados_escavador_completos (JSON string)
          if (row.dados_escavador_completos) {
            try {
              const dados = typeof row.dados_escavador_completos === 'string' 
                ? JSON.parse(row.dados_escavador_completos)
                : row.dados_escavador_completos;
              
              if (dados.numero_cnj) {
                row.numero_cnj = dados.numero_cnj;
              }
            } catch (e) {
              console.error(`Linha ${index + 1}: Erro ao parsear dados_escavador_completos`, e);
            }
          }
          
          // Tentar extrair de outras colunas possíveis
          if (!row.numero_cnj && row.numero) {
            row.numero_cnj = row.numero;
          }
          if (!row.numero_cnj && row.processo_numero) {
            row.numero_cnj = row.processo_numero;
          }
        }
        
        // Limpar numero_cnj: remover pontuação, espaços e letras
        if (row.numero_cnj) {
          row.numero_cnj = row.numero_cnj.toString().trim().replace(/[^\d]/g, '');
        }
        
        if (!row.numero_cnj) {
          erros.push({ 
            linha: index + 1, 
            erro: 'numero_cnj obrigatório',
            dados: `escritorio_id: ${row.escritorio_id || 'N/A'}, possui dados_escavador? ${!!row.dados_escavador_completos}`
          });
        }
        if (!row.escritorio_id && !escritorioId) {
          erros.push({ linha: index + 1, erro: 'escritorio_id obrigatório' });
        }
        if (row.numero_cnj && row.numero_cnj.length !== 20 && row.numero_cnj.length !== 25) {
          avisos.push({ 
            linha: index + 1, 
            aviso: 'Formato CNJ possivelmente inválido',
            numero_cnj: row.numero_cnj,
            tamanho: row.numero_cnj.length
          });
        }
      });

      return Response.json({
        success: erros.length === 0,
        total: dados.length,
        validos: dados.length - erros.length,
        erros,
        avisos
      });
    }

    // FASE 2: IMPORTAR EM LOTE
    if (action === 'import') {
      const lote = dados.slice(startIndex, startIndex + batchSize);
      const resultados = { sucesso: 0, erros: [], avisos: [] };

      for (const row of lote) {
        try {
          // EXTRAÇÃO INTELIGENTE: tentar extrair numero_cnj de diferentes campos
          if (!row.numero_cnj) {
            // Tentar extrair de dados_escavador_completos (JSON string)
            if (row.dados_escavador_completos) {
              try {
                const dados = typeof row.dados_escavador_completos === 'string' 
                  ? JSON.parse(row.dados_escavador_completos)
                  : row.dados_escavador_completos;
                
                if (dados.numero_cnj) {
                  row.numero_cnj = dados.numero_cnj;
                  
                  // Extrair outros campos úteis do JSON
                  if (!row.titulo_polo_ativo && dados.titulo_polo_ativo) {
                    row.titulo_polo_ativo = dados.titulo_polo_ativo;
                  }
                  if (!row.titulo_polo_passivo && dados.titulo_polo_passivo) {
                    row.titulo_polo_passivo = dados.titulo_polo_passivo;
                  }
                  if (!row.tribunal && dados.estado_origem?.sigla) {
                    row.tribunal = dados.estado_origem.sigla;
                  }
                  if (!row.ano_inicio && dados.ano_inicio) {
                    row.ano_inicio = dados.ano_inicio;
                  }
                  if (!row.data_inicio && dados.data_inicio) {
                    row.data_inicio = dados.data_inicio;
                  }
                  if (!row.data_ultima_movimentacao && dados.data_ultima_movimentacao) {
                    row.data_ultima_movimentacao = dados.data_ultima_movimentacao;
                  }
                  if (!row.quantidade_movimentacoes && dados.quantidade_movimentacoes) {
                    row.quantidade_movimentacoes = dados.quantidade_movimentacoes;
                  }
                  if (!row.fontes && dados.fontes) {
                    row.fontes = dados.fontes;
                  }
                  if (!row.envolvidos && dados.fontes?.[0]?.envolvidos) {
                    row.envolvidos = dados.fontes[0].envolvidos;
                  }
                }
              } catch (e) {
                console.error('Erro ao parsear dados_escavador_completos:', e);
              }
            }
            
            // Tentar extrair de outras colunas possíveis
            if (!row.numero_cnj && row.numero) {
              row.numero_cnj = row.numero;
            }
            if (!row.numero_cnj && row.processo_numero) {
              row.numero_cnj = row.processo_numero;
            }
          }
          
          // Limpar numero_cnj: remover pontuação, espaços e letras
          if (row.numero_cnj) {
            row.numero_cnj = row.numero_cnj.toString().trim().replace(/[^\d]/g, '');
          }
          
          if (!row.numero_cnj) {
            throw new Error('numero_cnj não encontrado após extração');
          }
          
          // Mapear campos da API Escavador para o schema
          const processoData = {
            id: row.numero_cnj, // ID = numero_cnj para facilitar backup
            escritorio_id: row.escritorio_id || escritorioId,
            numero_cnj: row.numero_cnj,
            titulo: row.titulo || row.titulo_polo_ativo || '',
            cliente_id: row.cliente_id || null,
            processo_pai_id: row.processo_pai_id || null,
            relation_type: row.relation_type || null,
            apensos_raw: row.apensos_raw || null,
            tribunal: row.tribunal || null,
            sistema: row.sistema || null,
            status: row.status || 'ativo',
            instancia: row.instancia || null,
            assunto: row.assunto || null,
            classe: row.classe || null,
            area: row.area || null,
            orgao_julgador: row.orgao_julgador || null,
            data_distribuicao: row.data_distribuicao || null,
            valor_causa: row.valor_causa || null,
            polo_ativo: row.polo_ativo || row.titulo_polo_ativo || null,
            polo_passivo: row.polo_passivo || row.titulo_polo_passivo || null,
            observacoes: row.observacoes || null,
            fonte_origem: row.fonte_origem || 'IMPORTACAO_CSV',
            log_importacao_id: row.log_importacao_id || null,
            visivel: row.visivel !== false,
            data_ultima_movimentacao: row.data_ultima_movimentacao || null,
            quantidade_movimentacoes: row.quantidade_movimentacoes || 0,
            data_ultima_verificacao: row.data_ultima_verificacao || null,
            tempo_desde_ultima_verificacao: row.tempo_desde_ultima_verificacao || null,
            fontes_tribunais_arquivadas: row.fontes_tribunais_arquivadas === true,
            ano_inicio: row.ano_inicio || null,
            data_inicio: row.data_inicio || null,
            estado_origem_nome: row.estado_origem_nome || row.estado_origem?.nome || null,
            estado_origem_sigla: row.estado_origem_sigla || row.estado_origem?.sigla || null,
            
            // Arrays e objetos complexos
            movimentacoes: parseJSON(row.movimentacoes) || [],
            audiencias: parseJSON(row.audiencias) || [],
            processos_relacionados: parseJSON(row.processos_relacionados) || [],
            fontes: parseJSON(row.fontes) || [],
            envolvidos: parseJSON(row.envolvidos) || [],
            assuntos_normalizados: parseJSON(row.assuntos_normalizados) || [],
            orgao_julgador_normalizado: parseJSON(row.orgao_julgador_normalizado) || null,
            unidade_origem: parseJSON(row.unidade_origem) || null,
            valor_causa_objeto: parseJSON(row.valor_causa_objeto) || null,
            
            // Campos adicionais Escavador
            situacao_processo: row.situacao_processo || row.situacao || null,
            grau_instancia: row.grau_instancia || row.grau || null,
            
            // Guardar resposta completa da API
            dados_completos_api: row.dados_completos_api ? parseJSON(row.dados_completos_api) : row
          };

          // Verificar se já existe
          const existe = await base44.asServiceRole.entities.Processo.filter({ 
            id: processoData.id 
          });

          let processoExistente = null;
          if (existe.length > 0) {
            // Atualizar
            await base44.asServiceRole.entities.Processo.update(
              processoData.id, 
              processoData
            );
            processoExistente = existe[0];
            resultados.avisos.push({ 
              numero_cnj: processoData.numero_cnj, 
              acao: 'atualizado' 
            });
          } else {
            // Criar
            await base44.asServiceRole.entities.Processo.create(processoData);
          }

          // IMPORTAR ENTIDADES RELACIONADAS
          await importarEntidadesRelacionadas(base44, processoData, row, escritorioId);
          
          // PROCESSAR APENSOS
          const apensos = parseApensos(row.apensos_raw || row.processos_relacionados);
          if (apensos.length > 0) {
            await importarApensos(base44, processoData.id, apensos, escritorioId);
          }
          
          resultados.sucesso++;
        } catch (error) {
          if (!ignorarErros) {
            resultados.erros.push({
              numero_cnj: row.numero_cnj,
              erro: error.message
            });
          } else {
            resultados.avisos.push({
              numero_cnj: row.numero_cnj,
              acao: 'ignorado',
              motivo: error.message
            });
          }
        }
      }

      return Response.json({
        success: true,
        lote_processado: lote.length,
        proximo_index: startIndex + batchSize,
        total_restante: dados.length - (startIndex + batchSize),
        resultados
      });
    }

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});

function parseJSON(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function importarEntidadesRelacionadas(base44, processoData, row, escritorioId) {
  const processo_id = processoData.id;
  const esc_id = processoData.escritorio_id;

  try {
    // 1. PARTES DO PROCESSO (Crítico)
    const envolvidos = row.envolvidos || parseJSON(row.envolvidos) || [];
    for (const env of envolvidos) {
      if (env.nome) {
        const tipoParteMapeado = env.polo === 'ATIVO' ? 'polo_ativo' : 
                                 env.polo === 'PASSIVO' ? 'polo_passivo' : 
                                 'terceiro_interessado';

        const cpf_cnpj = env.cpf || env.cnpj || null;
        
        // Buscar cliente existente por CPF/CNPJ
        let cliente_id = null;
        if (cpf_cnpj) {
          try {
            const clientesEncontrados = await base44.asServiceRole.entities.Cliente.filter({
              cpf_cnpj: cpf_cnpj,
              escritorio_id: esc_id
            });
            if (clientesEncontrados.length > 0) {
              cliente_id = clientesEncontrados[0].id;
            }
          } catch (error) {
            console.warn('Erro ao buscar cliente por CPF/CNPJ:', error);
          }
        }

        try {
          await base44.asServiceRole.entities.ProcessoParte.create({
            id: `${processo_id}_${env.nome.replace(/\s/g, '_')}_${Math.random().toString(36).substr(2, 9)}`,
            escritorio_id: esc_id,
            processo_id,
            tipo_parte: tipoParteMapeado,
            tipo_pessoa: env.tipo_pessoa === 'FISICA' ? 'fisica' : 'juridica',
            nome: env.nome,
            cpf_cnpj: cpf_cnpj,
            cliente_id: cliente_id,
            e_cliente_escritorio: !!cliente_id,
            qualificacao: env.tipo_normalizado || env.tipo,
            advogados: env.advogados?.map(adv => ({
              nome: adv.nome,
              oab_numero: adv.oabs?.[0]?.numero,
              oab_uf: adv.oabs?.[0]?.uf,
              quantidade_processos: adv.quantidade_processos
            })) || [],
            dados_completos_api: env
          });
        } catch (error) {
          if (!error.message?.includes('duplicate')) {
            console.error('Erro ao criar parte:', error);
          }
        }
      }
    }

    // 2. FONTES/TRIBUNAIS (Crítico)
    const fontes = row.fontes || parseJSON(row.fontes) || [];
    for (const fonte of fontes) {
      const fonte_id = `${processo_id}_${fonte.sigla}_${fonte.grau}`;
      
      try {
        await base44.asServiceRole.entities.ProcessoFonte.create({
          id: fonte_id,
          escritorio_id: esc_id,
          processo_id,
          tribunal_sigla: fonte.sigla,
          tribunal_nome: fonte.nome,
          grau: fonte.grau,
          grau_formatado: fonte.grau_formatado,
          sistema: fonte.sistema,
          url: fonte.url,
          status_predito: fonte.status_predito,
          arquivado: fonte.arquivado,
          fisico: fonte.fisico,
          data_inicio: fonte.data_inicio,
          data_ultima_movimentacao: fonte.data_ultima_movimentacao,
          quantidade_movimentacoes: fonte.quantidade_movimentacoes,
          capa: fonte.capa,
          dados_completos_api: fonte
        });
      } catch (error) {
        // Ignora duplicatas (constraint violation) ou entidade não existente
        if (!error.message?.includes('duplicate') && !error.message?.includes('does not exist')) {
          console.error('Erro ao criar fonte:', error);
        }
      }

      // 3. MOVIMENTAÇÕES (Crítico)
      const movimentacoes = fonte.movimentacoes || [];
      for (const mov of movimentacoes.slice(0, 30)) { // Limita a 30 por fonte (performance)
        try {
          await base44.asServiceRole.entities.MovimentacaoProcesso.create({
            escritorio_id: esc_id,
            processo_id,
            data: mov.data || mov.data_movimentacao,
            descricao: mov.descricao || mov.texto,
            tipo_movimentacao: mov.tipo,
            codigo_movimentacao: mov.codigo,
            documentos_associados: mov.documentos || [],
            origem_api: mov
          });
        } catch (error) {
          // Ignora apenas duplicatas
          if (!error.message?.includes('duplicate')) {
            console.error('Erro ao criar movimentação:', error.message);
          }
        }
      }

      // 4. AUDIÊNCIAS (Opcional)
      const audiencias = fonte.audiencias || [];
      for (const aud of audiencias) {
        try {
          await base44.asServiceRole.entities.AudienciaProcesso.create({
            escritorio_id: esc_id,
            processo_id,
            data: aud.data,
            tipo: aud.tipo?.toLowerCase() || 'una',
            status: aud.situacao === 'Cancelada' ? 'cancelada' : 
                    aud.situacao === 'Realizada' ? 'realizada' : 'agendada',
            participantes: aud.participantes || [],
            origem_api: aud
          });
        } catch (error) {
          // Ignora apenas duplicatas
          if (!error.message?.includes('duplicate')) {
            console.error('Erro ao criar audiência:', error.message);
          }
        }
      }
    }

    // 5. ASSUNTOS NORMALIZADOS (Opcional)
    const assuntos = row.assuntos_normalizados || parseJSON(row.assuntos_normalizados) || [];
    for (const assunto of assuntos) {
      if (assunto.id) {
        try {
          await base44.asServiceRole.entities.AssuntoNormalizado.create({
            id: `assunto_${assunto.id}`,
            assunto_id_externo: assunto.id,
            nome: assunto.nome,
            nome_com_pai: assunto.nome_com_pai,
            path_completo: assunto.path_completo,
            bloqueado: assunto.bloqueado
          });
        } catch (error) {
          // Ignora apenas duplicatas
          if (!error.message?.includes('duplicate')) {
            console.error('Erro ao criar assunto:', error.message);
          }
        }
      }
    }

  } catch (error) {
    console.error('Erro ao importar entidades relacionadas:', error);
    // Não falha a importação do processo principal
  }
}

function parseApensos(apensos) {
  if (!apensos) return [];
  
  // Se for string separada por vírgula
  if (typeof apensos === 'string') {
    return apensos.split(',')
      .map(a => a.trim())
      .filter(a => a.length === 20)
      .map(numero_cnj => ({ numero_cnj, tipo: 'apenso' }));
  }
  
  // Se for array de objetos
  if (Array.isArray(apensos)) {
    return apensos
      .filter(a => a.numero_cnj || a.numero)
      .map(a => ({
        numero_cnj: (a.numero_cnj || a.numero).replace(/\D/g, ''),
        tipo: a.tipo_relacao || a.tipo || 'apenso'
      }));
  }
  
  return [];
}

async function importarApensos(base44, processo_id, apensos, escritorioId) {
  for (const apenso of apensos) {
    try {
      // Verificar se processo apenso existe
      const processoApenso = await base44.asServiceRole.entities.Processo.filter({
        numero_cnj: apenso.numero_cnj
      });
      
      if (processoApenso.length === 0) {
        // Criar processo apenso básico
        await base44.asServiceRole.entities.Processo.create({
          id: apenso.numero_cnj,
          escritorio_id: escritorioId,
          numero_cnj: apenso.numero_cnj,
          titulo: `Apenso de ${processo_id}`,
          processo_pai_id: processo_id,
          relation_type: apenso.tipo || 'apenso',
          status: 'ativo',
          fonte_origem: 'IMPORTACAO_APENSO'
        });
      } else if (!processoApenso[0].processo_pai_id) {
        // Atualizar relacionamento se ainda não existe
        await base44.asServiceRole.entities.Processo.update(processoApenso[0].id, {
          processo_pai_id: processo_id,
          relation_type: apenso.tipo || 'apenso'
        });
      }
    } catch (error) {
      console.error(`Erro ao importar apenso ${apenso.numero_cnj}:`, error);
    }
  }
}