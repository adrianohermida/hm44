import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nome, cpf_cnpj, escritorio_id, quantidade_processos = 5000 } = await req.json();

    if (!nome) {
      return Response.json({
        success: false,
        error: 'Nome é obrigatório para busca na API Escavador'
      }, { status: 400 });
    }

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'ESCAVADOR_API_TOKEN não configurado' }, { status: 500 });
    }

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
      return Response.json({ 
        error: `Escavador API error: ${error}` 
      }, { status: response.status });
    }

    const data = await response.json();

    await base44.asServiceRole.entities.ConsumoAPIEscavador.create({
      escritorio_id,
      usuario_email: user.email,
      endpoint: '/api/v2/envolvido/processos',
      versao_api: 'V2',
      operacao: 'BUSCA_NOME',
      creditos_utilizados: 1,
      status_resposta: 200,
      sucesso: true,
      parametros: { nome, cpf_cnpj }
    });

    // Buscar processos existentes
    const processosExistentes = await base44.asServiceRole.entities.Processo.filter({
      escritorio_id
    });
    
    const numerosExistentes = new Set(
      processosExistentes.map(p => p.numero_cnj?.replace(/\D/g, ''))
    );

    // Buscar cliente por CPF/CNPJ para associação automática
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

    const processosImportados = [];
    const processosDuplicados = [];
    
    for (const item of data.items || []) {
      const numeroCNJ = item.numero_cnj?.replace(/\D/g, '');
      
      if (!numeroCNJ) continue;

      if (numerosExistentes.has(numeroCNJ)) {
        processosDuplicados.push(numeroCNJ);
        continue;
      }

      try {
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
          fonte_origem: 'Escavador - Busca por Nome',
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

        processosImportados.push({
          ...processo,
          cliente_associado: !!clienteId
        });
      } catch (error) {
        console.error(`Erro ao importar processo ${numeroCNJ}:`, error);
      }
    }

    return Response.json({
      success: true,
      envolvido_encontrado: data.envolvido_encontrado,
      found: data.items?.length || 0,
      imported: processosImportados.length,
      duplicados: processosDuplicados.length,
      processos_novos: processosImportados,
      processos_duplicados: processosDuplicados
    });

  } catch (error) {
    console.error('Erro buscarProcessosEnvolvido:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});