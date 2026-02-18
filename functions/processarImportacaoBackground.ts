import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { job_id, nome, cpf_cnpj, escritorio_id, quantidade_processos, usuario_email } = await req.json();

    if (!job_id || !nome || !escritorio_id) {
      return Response.json({ error: 'Parâmetros obrigatórios faltando' }, { status: 400 });
    }

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!token) {
      await base44.asServiceRole.entities.JobImportacao.update(job_id, {
        status: 'erro',
        erro_detalhes: 'ESCAVADOR_API_TOKEN não configurado'
      });
      return Response.json({ error: 'Token não configurado' }, { status: 500 });
    }

    // Atualizar job para "executando"
    await base44.asServiceRole.entities.JobImportacao.update(job_id, {
      status: 'executando',
      mensagem: 'Buscando processos na API Escavador...',
      progresso: 5
    });

    // Buscar processos da API Escavador
    const baseUrl = 'https://api.escavador.com/api/v2/envolvido/processos';
    const params = new URLSearchParams();
    params.append('nome', nome);
    params.append('quantidade_processos', quantidade_processos.toString());
    
    if (cpf_cnpj) {
      const doc = cpf_cnpj.replace(/\D/g, '');
      if (doc.length === 11) {
        params.append('cpf', doc);
      } else if (doc.length === 14) {
        params.append('cnpj', doc);
      }
    }

    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      await base44.asServiceRole.entities.JobImportacao.update(job_id, {
        status: 'erro',
        erro_detalhes: `API Error: ${error}`,
        progresso: 0
      });
      return Response.json({ error: `API Error: ${error}` }, { status: response.status });
    }

    const data = await response.json();
    const totalProcessos = data.items?.length || 0;

    // Atualizar total de itens
    await base44.asServiceRole.entities.JobImportacao.update(job_id, {
      total_itens: totalProcessos,
      mensagem: `${totalProcessos} processos encontrados. Iniciando importação...`,
      progresso: 10
    });

    // Buscar processos existentes
    const processosExistentes = await base44.asServiceRole.entities.Processo.filter({
      escritorio_id
    });
    
    const numerosExistentes = new Set(
      processosExistentes.map(p => p.numero_cnj?.replace(/\D/g, ''))
    );

    // Buscar cliente para associação
    let clienteId = null;
    if (cpf_cnpj) {
      const clientes = await base44.asServiceRole.entities.Cliente.filter({
        escritorio_id,
        cpf_cnpj: cpf_cnpj.replace(/\D/g, '')
      });
      if (clientes.length > 0) {
        clienteId = clientes[0].id;
      }
    }

    // Processar em lotes com rate limiting
    const BATCH_SIZE = 10;
    const DELAY_MS = 2000; // 2 segundos entre lotes
    let processados = 0;
    let importados = 0;
    let duplicados = 0;
    let erros = 0;

    const items = data.items || [];
    
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      
      for (const item of batch) {
        try {
          const numeroCNJ = item.numero_cnj?.replace(/\D/g, '');
          
          if (!numeroCNJ) {
            erros++;
            processados++;
            continue;
          }

          if (numerosExistentes.has(numeroCNJ)) {
            duplicados++;
            processados++;
            continue;
          }

          // Importar processo
          const fonte = item.fontes?.[0] || {};
          const capa = fonte.capa || {};
          
          const processo = await base44.asServiceRole.entities.Processo.create({
            escritorio_id,
            cliente_id: clienteId,
            numero_cnj: numeroCNJ,
            titulo: item.titulo_polo_ativo || capa.classe || 'Processo',
            tribunal: fonte.tribunal?.sigla || '',
            sistema: fonte.sistema || '',
            instancia: fonte.grau_formatado || '',
            grau_instancia: fonte.grau,
            assunto: capa.assunto || '',
            classe: capa.classe || '',
            area: capa.area || '',
            orgao_julgador: capa.orgao_julgador || '',
            data_distribuicao: item.data_inicio || capa.data_distribuicao,
            valor_causa: capa.valor_causa?.valor_formatado || '',
            polo_ativo: item.titulo_polo_ativo || '',
            polo_passivo: item.titulo_polo_passivo || '',
            quantidade_movimentacoes: item.quantidade_movimentacoes || 0,
            data_ultima_movimentacao: item.data_ultima_movimentacao,
            situacao_processo: fonte.status_predito,
            dados_completos_api: item,
            fonte_origem: 'Busca Tribunal Background',
            log_importacao_id: job_id,
            status: 'ativo',
            visivel: true
          });

          // Importar fontes
          if (item.fontes?.length > 0) {
            for (const fonte of item.fontes) {
              await base44.asServiceRole.entities.ProcessoFonte.create({
                processo_id: processo.id,
                escritorio_id,
                fonte_id: fonte.id,
                processo_fonte_id: fonte.processo_fonte_id,
                tribunal_sigla: fonte.tribunal?.sigla,
                tribunal_nome: fonte.tribunal?.nome,
                tipo_fonte: fonte.tipo,
                grau: fonte.grau,
                grau_formatado: fonte.grau_formatado,
                sistema: fonte.sistema,
                data_inicio: fonte.data_inicio,
                data_ultima_movimentacao: fonte.data_ultima_movimentacao,
                status_predito: fonte.status_predito,
                arquivado: fonte.arquivado,
                url: fonte.url,
                quantidade_movimentacoes: fonte.quantidade_movimentacoes,
                dados_completos: fonte
              }).catch(err => console.error('Erro ao criar fonte:', err));
            }
          }

          // Importar partes
          for (const fonte of item.fontes || []) {
            for (const envolvido of fonte.envolvidos || []) {
              await base44.asServiceRole.entities.ProcessoParte.create({
                escritorio_id,
                processo_id: processo.id,
                nome: envolvido.nome,
                tipo_pessoa: envolvido.tipo_pessoa?.toLowerCase() || 'fisica',
                tipo_parte: envolvido.polo === 'ATIVO' ? 'polo_ativo' : 
                           envolvido.polo === 'PASSIVO' ? 'polo_passivo' : 'terceiro_interessado',
                qualificacao: envolvido.tipo_normalizado || '',
                cpf_cnpj: envolvido.cpf || envolvido.cnpj || '',
                polo_escavador: envolvido.polo,
                advogados: envolvido.advogados || [],
                oabs: envolvido.oabs || [],
                dados_completos_api: envolvido
              }).catch(err => console.error('Erro ao criar parte:', err));
            }
          }

          importados++;
          numerosExistentes.add(numeroCNJ);
        } catch (error) {
          console.error(`Erro ao importar processo:`, error);
          erros++;
        }
        
        processados++;
      }

      // Atualizar progresso
      const progresso = 10 + Math.floor((processados / totalProcessos) * 90);
      await base44.asServiceRole.entities.JobImportacao.update(job_id, {
        itens_processados: processados,
        itens_importados: importados,
        itens_duplicados: duplicados,
        itens_erro: erros,
        progresso,
        mensagem: `Processados: ${processados}/${totalProcessos} • Importados: ${importados} • Duplicados: ${duplicados}`
      });

      // Pausa entre lotes (rate limiting)
      if (i + BATCH_SIZE < items.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }

    // Registrar consumo API
    await base44.asServiceRole.entities.ConsumoAPIEscavador.create({
      escritorio_id,
      usuario_email,
      endpoint: '/api/v2/envolvido/processos',
      versao_api: 'V2',
      operacao: 'BUSCA_NOME',
      creditos_utilizados: Math.ceil(totalProcessos / 100),
      status_resposta: 200,
      sucesso: true,
      parametros: { nome, cpf_cnpj, quantidade_processos, background: true }
    });

    // Finalizar job
    await base44.asServiceRole.entities.JobImportacao.update(job_id, {
      status: 'concluido',
      progresso: 100,
      mensagem: 'Importação concluída!',
      concluido_em: new Date().toISOString()
    });

    // Criar notificação de conclusão
    await base44.asServiceRole.entities.Notificacao.create({
      escritorio_id,
      usuario_email,
      tipo: 'importacao_concluida',
      titulo: 'Busca no Tribunal Concluída',
      mensagem: `${importados} processos importados • ${duplicados} duplicados • ${erros} erros`,
      lida: false,
      metadata: {
        job_id,
        nome,
        total_processos: totalProcessos,
        importados,
        duplicados,
        erros
      }
    });

    return Response.json({
      success: true,
      job_id,
      total_processos: totalProcessos,
      importados,
      duplicados,
      erros
    });

  } catch (error) {
    console.error('Erro processarImportacaoBackground:', error);
    
    // Tentar atualizar job para erro
    try {
      const base44 = createClientFromRequest(req);
      const { job_id } = await req.json();
      if (job_id) {
        await base44.asServiceRole.entities.JobImportacao.update(job_id, {
          status: 'erro',
          erro_detalhes: error.message,
          mensagem: 'Erro ao processar importação'
        });
      }
    } catch (updateError) {
      console.error('Erro ao atualizar job:', updateError);
    }
    
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});