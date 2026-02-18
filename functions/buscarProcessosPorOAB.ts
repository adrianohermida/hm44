import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Busca processos de um advogado por OAB
 * Endpoint: GET /api/v2/advogado/processos
 * Custo: 2 créditos por requisição
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { oab_numero, oab_estado, tribunal_sigla } = await req.json();
    
    if (!oab_numero || !oab_estado) {
      return Response.json({ error: 'Informe OAB número e estado' }, { status: 400 });
    }

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'Token Escavador não configurado' }, { status: 500 });
    }

    // Construir query string (método GET)
    const params = new URLSearchParams({
      oab_numero: oab_numero.toString(),
      oab_estado: oab_estado.toUpperCase()
    });
    if (tribunal_sigla) params.append('tribunal_sigla', tribunal_sigla);

    const response = await fetch(`https://api.escavador.com/api/v2/advogado/processos?${params.toString()}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ 
        error: data.error || 'Erro ao buscar processos',
        status: response.status 
      }, { status: response.status });
    }

    // Obter escritorio_id (multi-tenant safe)
    const escritorios = await base44.asServiceRole.entities.Escritorio.filter({
      $or: [
        { created_by: user.email },
        { usuarios_vinculados: { $contains: user.email } }
      ]
    });

    if (!escritorios[0]?.id) {
      return Response.json({ 
        error: 'Você não está vinculado a nenhum escritório' 
      }, { status: 403 });
    }
    const escritorioId = escritorios[0].id;

    // Registrar consumo ConsumoAPIEscavador (LEGACY)
    await base44.asServiceRole.entities.ConsumoAPIEscavador.create({
      escritorio_id: escritorioId,
      usuario_email: user.email,
      endpoint: '/api/v2/advogado/processos',
      versao_api: 'V2',
      operacao: 'BUSCA_OAB',
      creditos_utilizados: 2,
      status_resposta: response.status,
      sucesso: response.ok,
      parametros: { oab_numero, oab_estado, tribunal_sigla }
    });

    // Registrar consumo ConsumoAPIExterna (NOVO - módulo conectores)
    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: escritorioId,
      usuario_email: user.email,
      provedor_id: '6949735a71244b18c7a49e5e',
      endpoint_id: '694975c37f6e5b3a6f373a92',
      operacao: 'producao',
      parametros: { oab_numero, oab_estado, tribunal_sigla },
      sucesso: response.ok,
      http_status: response.status,
      tempo_resposta_ms: 0,
      creditos_consumidos: 2
    });

    // 💾 SALVAR TODOS PROCESSOS AUTOMATICAMENTE
    let processos_salvos = 0;
    const processos_retorno = [];

    for (const item of data.items || []) {
      const cnjLimpo = item.numero_cnj.replace(/\D/g, '');
      
      try {
        // Verificar se já existe
        const existe = await base44.asServiceRole.entities.Processo.filter({ 
          id: cnjLimpo,
          escritorio_id: escritorioId 
        });

        const primeiraFonte = item.fontes?.[0];
        const capa = primeiraFonte?.capa || {};

        const processoData = {
          id: cnjLimpo,
          escritorio_id: escritorioId,
          numero_cnj: cnjLimpo,
          titulo: item.titulo_polo_ativo || `Processo ${cnjLimpo}`,
          tribunal: item.unidade_origem?.tribunal_sigla,
          sistema: primeiraFonte?.sistema,
          status: primeiraFonte?.status_predito?.toLowerCase() || 'ativo',
          instancia: primeiraFonte?.grau_formatado,
          classe: capa.classe,
          assunto: capa.assunto,
          area: capa.area,
          orgao_julgador: capa.orgao_julgador,
          data_distribuicao: item.data_inicio,
          valor_causa: capa.valor_causa?.valor,
          polo_ativo: item.titulo_polo_ativo,
          polo_passivo: item.titulo_polo_passivo,
          fonte_origem: 'BUSCA_OAB',
          dados_completos_api: item
        };

        if (existe.length > 0) {
          await base44.asServiceRole.entities.Processo.update(cnjLimpo, processoData);
        } else {
          await base44.asServiceRole.entities.Processo.create(processoData);
        }

        // Salvar entidades relacionadas
        await salvarEntidadesRelacionadas(base44, item, cnjLimpo, escritorioId);
        processos_salvos++;

        processos_retorno.push({
          numero_cnj: cnjLimpo,
          titulo: processoData.titulo,
          tribunal: processoData.tribunal,
          classe: processoData.classe,
          salvo: true
        });
      } catch (e) {
        processos_retorno.push({
          numero_cnj: item.numero_cnj,
          titulo: item.titulo_polo_ativo,
          salvo: false,
          erro: e.message
        });
      }
    }

    return Response.json({ 
      processos: processos_retorno,
      total: processos_retorno.length,
      processos_salvos,
      creditos_consumidos: 2,
      advogado_encontrado: data.advogado_encontrado,
      paginator: data.paginator
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function salvarEntidadesRelacionadas(base44, processo, cnjLimpo, escritorioId) {
  // FONTES COMPLETAS
  for (const fonte of processo.fontes || []) {
    try {
      await base44.asServiceRole.entities.ProcessoFonte.create({
        processo_id: cnjLimpo,
        escritorio_id: escritorioId,
        fonte_id: fonte.id || 0,
        processo_fonte_id: fonte.processo_fonte_id || 0,
        outros_numeros: fonte.outros_numeros || [],
        tribunal_sigla: fonte.sigla || '',
        tribunal_nome: fonte.nome || '',
        tribunal_id: fonte.tribunal?.id,
        tribunal_categoria: fonte.tribunal?.categoria,
        tipo_fonte: fonte.tipo || 'TRIBUNAL',
        grau: fonte.grau || 1,
        grau_formatado: fonte.grau_formatado || 'Primeiro Grau',
        sistema: fonte.sistema || '',
        descricao: fonte.descricao || '',
        data_inicio: fonte.data_inicio,
        data_ultima_movimentacao: fonte.data_ultima_movimentacao,
        data_ultima_verificacao: fonte.data_ultima_verificacao,
        status_predito: fonte.status_predito || 'ATIVO',
        arquivado: fonte.arquivado || false,
        segredo_justica: fonte.segredo_justica || false,
        fisico: fonte.fisico || false,
        url: fonte.url || '',
        quantidade_envolvidos: fonte.quantidade_envolvidos || 0,
        quantidade_movimentacoes: fonte.quantidade_movimentacoes || 0,
        capa_completa: fonte.capa || {},
        dados_completos: fonte
      });

      // AUDIÊNCIAS ESCAVADOR
      if (fonte.audiencias?.length > 0) {
        for (const aud of fonte.audiencias) {
          try {
            await base44.asServiceRole.entities.ProcessoAudienciaEscavador.create({
              processo_id: cnjLimpo,
              escritorio_id: escritorioId,
              fonte_id: fonte.id || 0,
              escavador_id: aud.id || 0,
              data: aud.data,
              tipo: aud.tipo || '',
              situacao: aud.situacao || '',
              local: aud.local || '',
              observacoes: aud.observacoes || '',
              dados_completos: aud
            });
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  // PARTES COMPLETAS
  const partesProcessadas = new Set();
  for (const fonte of processo.fontes || []) {
    for (const env of fonte.envolvidos || []) {
      const chave = env.cpf || env.cnpj || `${env.nome}_${env.tipo}`;
      if (partesProcessadas.has(chave)) continue;
      partesProcessadas.add(chave);

      try {
        await base44.asServiceRole.entities.ProcessoParte.create({
          processo_id: cnjLimpo,
          escritorio_id: escritorioId,
          nome: env.nome || 'Não informado',
          prefixo: env.prefixo || null,
          sufixo: env.sufixo || null,
          tipo_pessoa: env.tipo_pessoa === 'FISICA' ? 'fisica' : 'juridica',
          qualificacao: env.tipo_normalizado || env.tipo || '',
          polo_escavador: env.polo || 'DESCONHECIDO',
          tipo_parte: env.polo === 'ATIVO' ? 'polo_ativo' : 
                      env.polo === 'PASSIVO' ? 'polo_passivo' : 'terceiro_interessado',
          cpf_cnpj: env.cpf || env.cnpj || null,
          oabs: env.oabs || [],
          advogados: (env.advogados || []).map(adv => ({
            nome: adv.nome || '',
            oab_numero: adv.oabs?.[0]?.numero?.toString() || null,
            oab_uf: adv.oabs?.[0]?.uf || null,
            cpf: adv.cpf || null,
            tipo_pessoa: adv.tipo_pessoa || 'FISICA',
            quantidade_processos: adv.quantidade_processos || 0
          })),
          dados_completos_api: env
        });
      } catch (e) {}
    }
  }

  // ASSUNTOS NORMALIZADOS
  const capa = processo.fontes?.[0]?.capa;
  if (capa?.assuntos_normalizados?.length > 0) {
    for (const assunto of capa.assuntos_normalizados) {
      try {
        await base44.asServiceRole.entities.AssuntoNormalizado.create({
          processo_id: cnjLimpo,
          escritorio_id: escritorioId,
          escavador_id: assunto.id || 0,
          nome: assunto.nome || 'Não informado',
          nome_com_pai: assunto.nome_com_pai || '',
          path_completo: assunto.path_completo || '',
          categoria_raiz: assunto.path_completo?.split('|')?.[0]?.trim() || '',
          bloqueado: assunto.bloqueado || false,
          e_assunto_principal: false
        });
      } catch (e) {}
    }
  }

  // ASSUNTO PRINCIPAL
  if (capa?.assunto_principal_normalizado) {
    const assunto = capa.assunto_principal_normalizado;
    try {
      await base44.asServiceRole.entities.AssuntoNormalizado.create({
        processo_id: cnjLimpo,
        escritorio_id: escritorioId,
        escavador_id: assunto.id || 0,
        nome: assunto.nome || 'Não informado',
        nome_com_pai: assunto.nome_com_pai || '',
        path_completo: assunto.path_completo || '',
        categoria_raiz: assunto.path_completo?.split('|')?.[0]?.trim() || '',
        bloqueado: assunto.bloqueado || false,
        e_assunto_principal: true
      });
    } catch (e) {}
  }

  // PROCESSOS RELACIONADOS
  if (processo.processos_relacionados?.length > 0) {
    for (const rel of processo.processos_relacionados) {
      try {
        await base44.asServiceRole.entities.ProcessoRelacionado.create({
          processo_id: cnjLimpo,
          escritorio_id: escritorioId,
          numero_relacionado: rel.numero,
          tipo_relacao: rel.tipo || 'relacionado'
        });
      } catch (e) {}
    }
  }

  // INFORMAÇÕES COMPLEMENTARES
  if (capa?.informacoes_complementares?.length > 0) {
    for (const info of capa.informacoes_complementares) {
      try {
        await base44.asServiceRole.entities.ProcessoInformacaoComplementar.create({
          processo_id: cnjLimpo,
          escritorio_id: escritorioId,
          tipo: info.tipo,
          valor: info.valor
        });
      } catch (e) {}
    }
  }
}