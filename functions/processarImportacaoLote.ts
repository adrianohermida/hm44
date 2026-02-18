import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as XLSX from 'npm:xlsx@0.18.5';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { job_id } = await req.json();
    const job = await base44.asServiceRole.entities.JobImportacao.filter({ id: job_id });
    if (!job.length) {
      return Response.json({ error: 'Job não encontrado' }, { status: 404 });
    }

    const jobData = job[0];
    await base44.asServiceRole.entities.JobImportacao.update(job_id, {
      status: 'PROCESSANDO',
      tempo_inicio: new Date().toISOString()
    });

    const fileResp = await fetch(jobData.arquivo_url);
    const buffer = await fileResp.arrayBuffer();
    let dados = [];

    if (jobData.formato_arquivo === 'XLSX') {
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      dados = XLSX.utils.sheet_to_json(sheet);
    } else if (jobData.formato_arquivo === 'JSON') {
      dados = JSON.parse(new TextDecoder().decode(buffer));
    } else {
      const text = new TextDecoder(jobData.encoding_detectado || 'utf-8').decode(buffer);
      const linhas = text.split('\n').filter(l => l.trim());
      const headers = linhas[0].split(jobData.delimitador_detectado);
      dados = linhas.slice(1).map(linha => {
        const valores = linha.split(jobData.delimitador_detectado);
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = valores[i]?.trim());
        return obj;
      });
    }

    const LOTE_SIZE = jobData.total_linhas > 5000 ? 100 : 50;
    const CHUNK_SIZE = 10;
    let processadas = 0;
    let sucesso = 0;
    let erros = [];

    for (let i = 0; i < dados.length; i += LOTE_SIZE) {
      const statusCheck = await base44.asServiceRole.entities.JobImportacao.filter({ id: job_id });
      if (statusCheck[0]?.status === 'PAUSADO') {
        await base44.asServiceRole.entities.JobImportacao.update(job_id, {
          status: 'PAUSADO',
          pode_recomecar: true
        });
        return Response.json({ success: false, pausado: true });
      }

      const lote = dados.slice(i, i + LOTE_SIZE);
      const registrosLote = [];

      for (const row of lote) {
        try {
          const mapped = {};
          Object.entries(jobData.mapeamento_colunas).forEach(([campo, coluna]) => {
            if (row[coluna] !== undefined && row[coluna] !== '') {
              mapped[campo] = row[coluna];
            }
          });
          mapped.escritorio_id = jobData.escritorio_id;
          registrosLote.push(mapped);
          sucesso++;
        } catch (err) {
          erros.push({ linha: processadas + 1, erro: err.message });
        }
        processadas++;
      }

      if (registrosLote.length > 0) {
        for (let j = 0; j < registrosLote.length; j += CHUNK_SIZE) {
          const chunk = registrosLote.slice(j, j + CHUNK_SIZE);
          await base44.asServiceRole.entities[jobData.tipo_entidade].bulkCreate(chunk);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      await base44.asServiceRole.entities.JobImportacao.update(job_id, {
        linhas_processadas: processadas,
        linhas_sucesso: sucesso,
        linhas_erro: erros.length,
        progresso_percentual: Math.round((processadas / dados.length) * 100),
        erros_detalhados: erros.slice(0, 200)
      });
    }

    await base44.asServiceRole.entities.JobImportacao.update(job_id, {
      status: 'CONCLUIDO',
      tempo_fim: new Date().toISOString()
    });

    return Response.json({ success: true, processadas, sucesso, erros: erros.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});