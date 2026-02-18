import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { SmartParser } from './utils/smartParser.js';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await req.json();
    
    const jobs = await base44.asServiceRole.entities.JobImportacao.filter({ id: jobId });
    if (jobs.length === 0) {
      return Response.json({ error: 'Job não encontrado' }, { status: 404 });
    }

    const job = jobs[0];

    // Verificar cancelamento
    if (job.status === 'cancelado') {
      return Response.json({ message: 'Job cancelado' });
    }

    if (job.status === 'processando' || job.status === 'concluido') {
      return Response.json({ message: 'Job já em processamento ou concluído' });
    }

    await base44.asServiceRole.entities.JobImportacao.update(jobId, {
      status: 'processando',
      tempo_inicio: new Date().toISOString()
    });

    processarEmBackground(jobId, job, base44, user.email);

    return Response.json({ success: true, jobId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function processarEmBackground(jobId, job, base44, userEmail) {
  const tempoInicio = Date.now();
  const resultados = { sucessos: 0, falhas: 0, erros: [], skipped: 0 };

  try {
    const dados = job.dados || [];
    const batchSize = job.batch_size || 100;
    const escritorioId = job.escritorio_id;
    const duplicateStrategy = job.opcoes?.duplicateStrategy || 'skip';

    for (let i = 0; i < dados.length; i += batchSize) {
      // Verificar cancelamento
      const jobAtual = await base44.asServiceRole.entities.JobImportacao.filter({ id: jobId });
      if (jobAtual[0]?.status === 'cancelado') {
        throw new Error('Job cancelado pelo usuário');
      }

      const lote = dados.slice(i, i + batchSize);

      for (const row of lote) {
        try {
          const resultado = await importarProcesso(base44, row, escritorioId, duplicateStrategy);
          if (resultado.acao === 'skipped') {
            resultados.skipped++;
          } else {
            resultados.sucessos++;
          }
        } catch (error) {
          if (duplicateStrategy === 'fail') {
            throw new Error(`Duplicado: ${row.numero_cnj}`);
          }
          
          const original = row.numero_cnj || row.processo || row.Processo || 'N/A';
          const errorMsg = error.message || String(error);
          
          resultados.falhas++;
          resultados.erros.push({
            numero_cnj: original,
            erro: errorMsg.includes('Rate limit') 
              ? 'Limite de requisições (aguarde)' 
              : errorMsg
          });
        }
      }

      const progresso = Math.floor(((i + lote.length) / dados.length) * 100);
      await base44.asServiceRole.entities.JobImportacao.update(jobId, {
        registros_processados: i + lote.length,
        registros_sucesso: resultados.sucessos,
        registros_falha: resultados.falhas,
        progresso_percentual: progresso,
        erros: resultados.erros.slice(-50)
      });
    }

    const duracaoSegundos = Math.floor((Date.now() - tempoInicio) / 1000);

    await base44.asServiceRole.entities.JobImportacao.update(jobId, {
      status: 'concluido',
      tempo_conclusao: new Date().toISOString(),
      duracao_segundos: duracaoSegundos
    });

    await base44.asServiceRole.entities.Notificacao.create({
      escritorio_id: escritorioId,
      user_email: userEmail,
      tipo: 'importacao_concluida',
      titulo: '✅ Importação concluída',
      mensagem: `${resultados.sucessos} processos importados em ${duracaoSegundos}s`,
      lida: false
    });
  } catch (error) {
    await base44.asServiceRole.entities.JobImportacao.update(jobId, {
      status: 'falhou',
      erro_mensagem: error.message
    });

    await base44.asServiceRole.entities.Notificacao.create({
      escritorio_id: job.escritorio_id,
      user_email: userEmail,
      tipo: 'importacao_falhou',
      titulo: '❌ Importação falhou',
      mensagem: error.message,
      lida: false
    });
  }
}

async function importarProcesso(base44, row, escritorioId, duplicateStrategy) {
  const original = row.numero_cnj || row.processo || row.Processo;
  const cnj = SmartParser.limparCNJ(original);
  
  if (!cnj) {
    const digitos = original ? String(original).replace(/[^0-9]/g, '').length : 0;
    throw new Error(`CNJ inválido: "${original}" (${digitos} dígitos, esperado: 20)`);
  }

  const processoData = {
    id: cnj,
    escritorio_id: escritorioId,
    numero_cnj: cnj,
    titulo: row.titulo || row.Título || SmartParser.gerarTituloAuto(row),
    tribunal: SmartParser.normalizarTribunal(row.tribunal || row.Tribunal),
    status: SmartParser.mapearStatus(row.status || row.Arquivado),
    polo_ativo: row.polo_ativo || row['Polo Ativo'],
    polo_passivo: row.polo_passivo || row['Polo Passivo'],
    classe: row.classe || row.Classe,
    assunto: row.assunto || row.Assunto,
    area: row.area || row['Área'],
    instancia: row.instancia || row['Instância'],
    orgao_julgador: row.orgao_julgador || row['Órgão julgador'],
    valor_causa: SmartParser.parseValor(row.valor_causa || row['Valor da causa']),
    data_distribuicao: SmartParser.parseData(row.data_distribuicao || row['Data de distribuição']),
    fonte_origem: 'IMPORTACAO_CSV',
    sync_status: 'pending',
    cnj_enriquecido: false
  };

  const existe = await base44.asServiceRole.entities.Processo.filter({ id: cnj });

  if (existe.length > 0) {
    // Aplicar estratégia de duplicados
    if (duplicateStrategy === 'skip') {
      return { acao: 'skipped', cnj };
    } else if (duplicateStrategy === 'fail') {
      throw new Error(`Processo ${cnj} já existe`);
    } else if (duplicateStrategy === 'update') {
      await base44.asServiceRole.entities.Processo.update(cnj, processoData);
      return { acao: 'updated', cnj };
    } else if (duplicateStrategy === 'merge') {
      const existente = existe[0];
      const merged = { ...existente };
      Object.entries(processoData).forEach(([k, v]) => {
        if (v && !existente[k]) merged[k] = v;
      });
      await base44.asServiceRole.entities.Processo.update(cnj, merged);
      return { acao: 'merged', cnj };
    }
  }

  await base44.asServiceRole.entities.Processo.create(processoData);
  return { acao: 'created', cnj };

  // Criar partes automaticamente
  if (processoData.polo_ativo) {
    try {
      await base44.asServiceRole.entities.ProcessoParte.create({
        processo_id: cnj,
        escritorio_id: escritorioId,
        nome: processoData.polo_ativo,
        tipo_parte: 'polo_ativo'
      });
    } catch {}
  }

  if (processoData.polo_passivo) {
    try {
      await base44.asServiceRole.entities.ProcessoParte.create({
        processo_id: cnj,
        escritorio_id: escritorioId,
        nome: processoData.polo_passivo,
        tipo_parte: 'polo_passivo'
      });
    } catch {}
  }
}