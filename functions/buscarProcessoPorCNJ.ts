import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numero_cnj, forcar_busca } = await req.json();
    console.log('[buscarProcessoPorCNJ] Input:', { numero_cnj, forcar_busca });
    
    if (!numero_cnj) return Response.json({ error: 'numero_cnj obrigatório' }, { status: 400 });

    const cnjLimpo = numero_cnj.replace(/\D/g, '');

    // Obter escritorio_id
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();

    if (!escritorios[0]?.id) {
      return Response.json({ 
        error: 'Você não está vinculado a nenhum escritório' 
      }, { status: 403 });
    }
    const escritorioId = escritorios[0].id;

    // 🔍 VERIFICAÇÃO PRÉVIA NA BASE (busca por duplicados com/sem formatação)
    const todoProcessos = await base44.asServiceRole.entities.Processo.filter({ 
      escritorio_id: escritorioId 
    });
    
    const processoExistente = todoProcessos.filter(p => {
      const pCnjLimpo = p.numero_cnj?.replace(/\D/g, '');
      return pCnjLimpo === cnjLimpo;
    });

    if (processoExistente.length > 0 && !forcar_busca) {
      // Retornar TODOS os processos encontrados (pode ter múltiplas classes/graus)
      const processosComFontes = [];
      
      for (const proc of processoExistente) {
        const partesExistentes = await base44.asServiceRole.entities.ProcessoParte.filter({ 
          processo_id: proc.id 
        });
        const fontesExistentes = await base44.asServiceRole.entities.ProcessoFonte.filter({ 
          processo_id: proc.id 
        });

        const dadosCompletos = !!(
          proc.titulo && 
          proc.classe && 
          proc.assunto && 
          partesExistentes.length > 0 && 
          fontesExistentes.length > 0
        );

        processosComFontes.push({
          processo: proc,
          partes: partesExistentes,
          fontes: fontesExistentes,
          dados_completos: dadosCompletos
        });
      }

      // Se todos estão completos, retornar lista
      const todosCompletos = processosComFontes.every(p => p.dados_completos);

      return Response.json({ 
        processo_existente: true,
        multiplos_processos: processoExistente.length > 1,
        dados_completos: todosCompletos,
        processos: processosComFontes,
        mensagem: processoExistente.length > 1 
          ? `${processoExistente.length} processos encontrados (múltiplas classes/graus)`
          : todosCompletos 
            ? 'Processo já existe na base com dados completos'
            : 'Processo existe mas está incompleto. Deseja enriquecer com dados da API?'
      });
    }

    // 🌐 BUSCAR NA API ESCAVADOR
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    const startTime = Date.now();
    
    const response = await fetch(`https://api.escavador.com/api/v2/processos/numero_cnj/${numero_cnj}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      return Response.json({ error: `API retornou status ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const tempo_resposta_ms = Date.now() - startTime;

    console.log('[buscarProcessoPorCNJ] API Response:', { 
      has_fontes: !!data?.fontes, 
      num_fontes: data?.fontes?.length,
      has_envolvidos: !!data?.fontes?.[0]?.envolvidos
    });

    if (!data || !data.fontes || data.fontes.length === 0) {
      return Response.json({ 
        error: 'Processo não encontrado na API Escavador',
        numero_cnj: cnjLimpo
      }, { status: 404 });
    }

    // Registrar consumo
    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: escritorioId,
      usuario_email: user.email,
      provedor_id: '6949735a71244b18c7a49e5e',
      endpoint_id: '69504bae8a48f485908ed7c1',
      operacao: 'producao',
      parametros: { numero_cnj },
      sucesso: true,
      http_status: response.status,
      creditos_consumidos: 1,
      tempo_resposta_ms
    });

    // 💾 SALVAR PROCESSO COMPLETO
    const processo = data;
    const primeiraFonte = processo.fontes?.[0];
    const capa = primeiraFonte?.capa || {};

    const processoData = {
      escritorio_id: escritorioId,
      numero_cnj: cnjLimpo,
      titulo: processo.titulo_polo_ativo || `Processo ${cnjLimpo}`,
      tribunal: processo.estado_origem?.sigla || processo.unidade_origem?.tribunal_sigla,
      sistema: primeiraFonte?.sistema,
      status: primeiraFonte?.status_predito?.toLowerCase() || 'ativo',
      instancia: primeiraFonte?.grau_formatado,
      classe: capa?.classe,
      assunto: capa?.assunto,
      area: capa?.area,
      orgao_julgador: capa?.orgao_julgador,
      data_distribuicao: processo.data_inicio || primeiraFonte?.data_inicio,
      valor_causa: capa?.valor_causa?.valor,
      polo_ativo: processo.titulo_polo_ativo,
      polo_passivo: processo.titulo_polo_passivo,
      fonte_origem: 'BUSCA_CNJ',
      dados_completos_api: processo
    };

    // Criar/atualizar processo (garantir CNJ limpo e evitar duplicados)
    if (processoExistente.length > 0) {
      // Atualizar primeiro processo encontrado, garantir CNJ limpo
      await base44.asServiceRole.entities.Processo.update(processoExistente[0].id, {
        ...processoData,
        numero_cnj: cnjLimpo
      });
      
      // Remover outros duplicados se existirem
      for (let i = 1; i < processoExistente.length; i++) {
        await base44.asServiceRole.entities.Processo.delete(processoExistente[i].id);
      }
    } else {
      await base44.asServiceRole.entities.Processo.create({
        ...processoData,
        id: cnjLimpo
      });
    }

    // 💾 SALVAR FONTES COMPLETAS
    const fontesIds = [];
    for (const fonte of processo.fontes || []) {
      try {
        if (!fonte.id) {
          console.log('[FONTE] Pulando fonte sem ID:', fonte);
          continue;
        }

        const fonteData = {
          processo_id: cnjLimpo,
          escritorio_id: escritorioId,
          fonte_id: fonte.id,
          processo_fonte_id: fonte.processo_fonte_id || 0,
          outros_numeros: fonte.outros_numeros || [],
          tribunal_sigla: fonte.sigla || '',
          tribunal_nome: fonte.nome || '',
          tribunal_id: fonte.tribunal?.id || null,
          tribunal_categoria: fonte.tribunal?.categoria || null,
          tipo_fonte: fonte.tipo || 'TRIBUNAL',
          grau: fonte.grau || 1,
          grau_formatado: fonte.grau_formatado || 'Primeiro Grau',
          sistema: fonte.sistema || '',
          descricao: fonte.descricao || '',
          data_inicio: fonte.data_inicio || null,
          data_ultima_movimentacao: fonte.data_ultima_movimentacao || null,
          data_ultima_verificacao: fonte.data_ultima_verificacao || null,
          status_predito: fonte.status_predito || 'ATIVO',
          arquivado: fonte.arquivado || false,
          segredo_justica: fonte.segredo_justica || false,
          fisico: fonte.fisico || false,
          url: fonte.url || '',
          quantidade_envolvidos: fonte.quantidade_envolvidos || 0,
          quantidade_movimentacoes: fonte.quantidade_movimentacoes || 0,
          capa_completa: fonte.capa || {},
          dados_completos: fonte
        };

        const novaFonte = await base44.asServiceRole.entities.ProcessoFonte.create(fonteData);
        fontesIds.push(novaFonte.id);

        // 💾 SALVAR AUDIÊNCIAS DA FONTE
        if (fonte.audiencias && fonte.audiencias.length > 0) {
          for (const audiencia of fonte.audiencias) {
            try {
              if (!audiencia.id) continue;
              
              await base44.asServiceRole.entities.ProcessoAudienciaEscavador.create({
                processo_id: cnjLimpo,
                escritorio_id: escritorioId,
                fonte_id: fonte.id,
                escavador_id: audiencia.id,
                data: audiencia.data || null,
                tipo: audiencia.tipo || '',
                situacao: audiencia.situacao || '',
                local: audiencia.local || '',
                observacoes: audiencia.observacoes || '',
                dados_completos: audiencia
              });
            } catch (e) {
              console.log('[AUDIÊNCIA] Erro ao salvar:', e.message);
            }
          }
        }
      } catch (e) {
        console.log('[FONTE] Erro ao salvar fonte:', fonte.id, e.message);
      }
    }

    // 💾 SALVAR PARTES COMPLETAS (de todas as fontes)
    const partesIds = [];
    const partesProcessadas = new Set();
    
    for (const fonte of processo.fontes || []) {
      for (const envolvido of fonte.envolvidos || []) {
        try {
          if (!envolvido.nome) continue;
          
          const chaveUnica = envolvido.cpf || envolvido.cnpj || `${envolvido.nome}_${envolvido.tipo}`;
          if (partesProcessadas.has(chaveUnica)) continue;
          partesProcessadas.add(chaveUnica);

          const parteData = {
            processo_id: cnjLimpo,
            escritorio_id: escritorioId,
            nome: envolvido.nome,
            prefixo: envolvido.prefixo || null,
            sufixo: envolvido.sufixo || null,
            tipo_pessoa: envolvido.tipo_pessoa === 'FISICA' ? 'fisica' : 'juridica',
            qualificacao: envolvido.tipo_normalizado || envolvido.tipo || '',
            polo_escavador: envolvido.polo || 'DESCONHECIDO',
            tipo_parte: envolvido.polo === 'ATIVO' ? 'polo_ativo' : 
                        envolvido.polo === 'PASSIVO' ? 'polo_passivo' : 
                        'terceiro_interessado',
            cpf_cnpj: envolvido.cpf || envolvido.cnpj || null,
            oabs: envolvido.oabs || [],
            advogados: (envolvido.advogados || []).map(adv => ({
              nome: adv.nome || '',
              oab_numero: adv.oabs?.[0]?.numero?.toString() || null,
              oab_uf: adv.oabs?.[0]?.uf || null,
              cpf: adv.cpf || null,
              tipo_pessoa: adv.tipo_pessoa || 'FISICA',
              quantidade_processos: adv.quantidade_processos || 0
            })),
            dados_completos_api: envolvido
          };

          const novaParte = await base44.asServiceRole.entities.ProcessoParte.create(parteData);
          partesIds.push(novaParte.id);
        } catch (e) {
          console.log('[PARTE] Erro ao salvar:', envolvido.nome, e.message);
        }
      }
    }

    // 💾 SALVAR ASSUNTOS NORMALIZADOS
    if (capa?.assuntos_normalizados?.length > 0) {
      for (const assunto of capa.assuntos_normalizados) {
        try {
          if (!assunto.nome) continue;
          
          await base44.asServiceRole.entities.AssuntoNormalizado.create({
            processo_id: cnjLimpo,
            escritorio_id: escritorioId,
            escavador_id: assunto.id || 0,
            nome: assunto.nome,
            nome_com_pai: assunto.nome_com_pai || '',
            path_completo: assunto.path_completo || '',
            categoria_raiz: assunto.path_completo?.split('|')?.[0]?.trim() || '',
            bloqueado: assunto.bloqueado || false,
            e_assunto_principal: false
          });
        } catch (e) {
          console.log('[ASSUNTO] Erro:', e.message);
        }
      }
    }

    // 💾 SALVAR ASSUNTO PRINCIPAL NORMALIZADO
    if (capa?.assunto_principal_normalizado?.nome) {
      const assunto = capa.assunto_principal_normalizado;
      try {
        await base44.asServiceRole.entities.AssuntoNormalizado.create({
          processo_id: cnjLimpo,
          escritorio_id: escritorioId,
          escavador_id: assunto.id || 0,
          nome: assunto.nome,
          nome_com_pai: assunto.nome_com_pai || '',
          path_completo: assunto.path_completo || '',
          categoria_raiz: assunto.path_completo?.split('|')?.[0]?.trim() || '',
          bloqueado: assunto.bloqueado || false,
          e_assunto_principal: true
        });
      } catch (e) {
        console.log('[ASSUNTO_PRINCIPAL] Erro:', e.message);
      }
    }

    // 💾 SALVAR PROCESSOS RELACIONADOS
    if (processo.processos_relacionados?.length > 0) {
      for (const relacionado of processo.processos_relacionados) {
        try {
          if (!relacionado.numero) continue;
          
          await base44.asServiceRole.entities.ProcessoRelacionado.create({
            processo_id: cnjLimpo,
            escritorio_id: escritorioId,
            numero_relacionado: relacionado.numero,
            tipo_relacao: relacionado.tipo || 'relacionado'
          });
        } catch (e) {
          console.log('[RELACIONADO] Erro:', e.message);
        }
      }
    }

    // 💾 SALVAR INFORMAÇÕES COMPLEMENTARES
    if (capa?.informacoes_complementares?.length > 0) {
      for (const info of capa.informacoes_complementares) {
        try {
          if (!info.tipo || !info.valor) continue;
          
          await base44.asServiceRole.entities.ProcessoInformacaoComplementar.create({
            processo_id: cnjLimpo,
            escritorio_id: escritorioId,
            tipo: info.tipo,
            valor: info.valor
          });
        } catch (e) {
          console.log('[INFO_COMPLEMENTAR] Erro:', e.message);
        }
      }
    }

    // 💾 BUSCAR E SALVAR MOVIMENTAÇÕES (todas as páginas)
    const movimentacoesInfo = await buscarTodasMovimentacoesEscavador(base44, req, cnjLimpo, escritorioId, user.email);

    return Response.json({ 
      sucesso: true,
      processo_criado: true,
      processo: processoData,
      fontes_salvas: fontesIds.length,
      partes_salvas: partesIds.length,
      movimentacoes_salvas: movimentacoesInfo.total_salvas,
      creditos_consumidos: 1 + movimentacoesInfo.creditos_gastos
    });
  } catch (error) {
    console.error('[buscarProcessoPorCNJ] ERRO CRÍTICO:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return Response.json({ 
      error: error.message,
      stack: error.stack.split('\n').slice(0, 5).join('\n'),
      tipo_erro: error.name,
      details: 'Erro ao buscar processo por CNJ'
    }, { status: 500 });
  }
});

async function buscarTodasMovimentacoesEscavador(base44, req, numero_cnj, escritorioId, userEmail) {
  let totalSalvas = 0;
  let creditosGastos = 0;
  
  try {
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    let nextCursor = null;

    do {
      const url = new URL(`https://api.escavador.com/api/v2/processos/numero_cnj/${numero_cnj}/movimentacoes`);
      if (nextCursor) url.searchParams.set('cursor', nextCursor);

      const startTime = Date.now();
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const tempo_resposta_ms = Date.now() - startTime;

      // Registrar consumo de cada página
      await base44.asServiceRole.entities.ConsumoAPIExterna.create({
        escritorio_id: escritorioId,
        usuario_email: userEmail,
        provedor_id: '6949735a71244b18c7a49e5e',
        endpoint_id: '695078494870a07fcfac171f',
        operacao: 'producao',
        parametros: { numero_cnj, cursor: nextCursor || null, pagina_importacao: Math.floor(totalSalvas / 20) + 1 },
        sucesso: response.ok,
        http_status: response.status,
        creditos_consumidos: response.ok ? 1 : 0,
        tempo_resposta_ms
      });

      if (response.ok) creditosGastos++;
      if (!response.ok) break;

      const data = await response.json();
      const items = data.items || [];

      // Salvar movimentações no banco
      for (const mov of items) {
        try {
          await base44.asServiceRole.entities.MovimentacaoProcesso.create({
            processo_id: numero_cnj,
            escritorio_id: escritorioId,
            escavador_id: mov.id,
            data: mov.data || null,
            tipo: mov.tipo || '',
            conteudo: mov.conteudo || '',
            pagina: mov.pagina || null,
            tipo_publicacao: mov.tipo_publicacao || null,
            texto_categoria: mov.texto_categoria || null,
            classificacao_predita_nome: mov.classificacao_predita?.nome || null,
            classificacao_predita_descricao: mov.classificacao_predita?.descricao || null,
            classificacao_predita_hierarquia: mov.classificacao_predita?.hierarquia || null,
            fonte_processo_fonte_id: mov.fonte?.processo_fonte_id || null,
            fonte_id: mov.fonte?.fonte_id || null,
            fonte_nome: mov.fonte?.nome || '',
            fonte_tipo: mov.fonte?.tipo || '',
            fonte_sigla: mov.fonte?.sigla || '',
            fonte_grau: mov.fonte?.grau || 1,
            fonte_grau_formatado: mov.fonte?.grau_formatado || '',
            fonte_caderno: mov.fonte?.caderno || null,
            fonte_link_web: mov.fonte?.link_web || null
          });
          totalSalvas++;
        } catch (e) {
          // Ignora duplicados
        }
      }

      nextCursor = data.links?.next ? new URL(data.links.next).searchParams.get('cursor') : null;

    } while (nextCursor);

    return { total_salvas: totalSalvas, creditos_gastos: creditosGastos };
  } catch (error) {
    console.error('[MovimentaçõesCompletas] Erro:', error.message);
    return { total_salvas: totalSalvas, creditos_gastos: creditosGastos };
  }
}