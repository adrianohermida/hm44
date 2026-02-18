import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analise_id } = await req.json();
    
    if (!analise_id) {
      return Response.json({ error: 'analise_id é obrigatório' }, { status: 400 });
    }
    
    console.log(`[Análise ${analise_id}] Requisição de ${user.email}`);
    
    const analises = await base44.asServiceRole.entities.DockerAnalise.filter({ id: analise_id });
    if (!analises.length) {
      return Response.json({ error: 'Análise não encontrada' }, { status: 404 });
    }
    const analise = analises[0];

    // Criar job
    const job = await base44.asServiceRole.entities.JobAnaliseDocker.create({
      escritorio_id: analise.escritorio_id,
      analise_id: analise.id,
      status: 'PENDENTE',
      progresso_percentual: 0,
      tempo_inicio: new Date().toISOString(),
      logs: [{
        timestamp: new Date().toISOString(),
        etapa: 'INICIO',
        mensagem: 'Análise iniciada',
        progresso: 0,
        tipo: 'INFO'
      }]
    });

    await base44.asServiceRole.entities.DockerAnalise.update(analise.id, {
      status: 'PROCESSANDO',
      progresso_percentual: 0,
      job_id: job.id
    });

    console.log(`[Análise ${analise_id}] Job criado: ${job.id}, iniciando background`);

    // Processar em background
    setTimeout(() => {
      processarAnaliseBackground(analise, job.id, base44)
        .then(() => console.log(`[Análise ${analise_id}] ✅ Concluída`))
        .catch(err => console.error(`[Análise ${analise_id}] ❌ Erro:`, err));
    }, 100);

    return Response.json({ sucesso: true, job_id: job.id });
    
  } catch (error) {
    console.error('Erro crítico em analisarDocumentosAPI:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});

async function processarAnaliseBackground(analise, jobId, base44Instance) {
  const updateJob = async (status, progresso, etapa, log) => {
    try {
      const jobs = await base44Instance.asServiceRole.entities.JobAnaliseDocker.filter({ id: jobId });
      if (!jobs.length) return;
      
      const job = jobs[0];
      const logs = job.logs || [];
      
      if (log) {
        logs.push({
          timestamp: new Date().toISOString(),
          etapa: status,
          mensagem: log,
          progresso,
          tipo: 'INFO'
        });
      }

      await base44Instance.asServiceRole.entities.JobAnaliseDocker.update(jobId, {
        status,
        progresso_percentual: progresso,
        etapa_atual: etapa,
        logs
      });

      await base44Instance.asServiceRole.entities.DockerAnalise.update(analise.id, { 
        progresso_percentual: progresso,
        status: progresso === 100 ? 'CONCLUIDO' : 'PROCESSANDO'
      });
    } catch (error) {
      console.error('Erro ao atualizar job:', error);
    }
  };

  try {
    await updateJob('EXTRAINDO_TEXTO', 10, 'Extraindo conteúdo do documento', 'Iniciando extração');

    let conteudo = '';
    if (analise.arquivo_url) {
      const fileRes = await fetch(analise.arquivo_url);
      conteudo = await fileRes.text();
    } else if (analise.url_documentacao) {
      const docRes = await fetch(analise.url_documentacao);
      conteudo = await docRes.text();
    }

    await updateJob('EXTRAINDO_TEXTO', 20, 'Conteúdo extraído', `Extraído ${conteudo.length} caracteres`);
    await updateJob('ANALISANDO_IA', 30, 'Enviando para análise IA', 'Processando com LLM');

    // Detectar tipo de documentação
    let tipoDoc = 'HTML';
    try {
      const jsonTest = JSON.parse(conteudo);
      if (jsonTest.swagger || jsonTest.openapi) tipoDoc = 'SWAGGER_JSON';
      else if (jsonTest.paths) tipoDoc = 'OPENAPI_JSON';
      else if (jsonTest.info && jsonTest.item) tipoDoc = 'POSTMAN_COLLECTION';
    } catch {
      if (conteudo.includes('swagger:') || conteudo.includes('openapi:')) {
        tipoDoc = 'OPENAPI_YAML';
      } else if (conteudo.includes('#%RAML') || conteudo.includes('raml:')) {
        tipoDoc = 'RAML';
      } else if (conteudo.includes('FORMAT: 1A') || conteudo.includes('# API Blueprint')) {
        tipoDoc = 'API_BLUEPRINT';
      }
    }

    await updateJob('ANALISANDO_IA', 35, `Tipo detectado: ${tipoDoc}`, 'Preparando extração');

    const llmPrompt = `Você é um especialista em análise de documentação de APIs REST.

📄 TIPO DE DOCUMENTAÇÃO: ${tipoDoc}
📊 TAMANHO: ${conteudo.length} caracteres

📋 CONTEÚDO:
${conteudo.substring(0, 80000)}

🎯 EXTRAIA COM PRIORIZAÇÃO:

**CRÍTICO (95-100):** /auth, /login, /token - "Autenticação necessária"
**IMPORTANTE (80-94):** POST principais, webhooks - "Core business"  
**NORMAL (60-79):** GET list, PUT - "Operações comuns"
**SECUNDÁRIO (40-59):** DELETE, uploads - "Complementares"
**OPCIONAL (0-39):** /health - "Não afeta funcionalidade"

📦 ESTRUTURA JSON:
{
  "metadados": {
    "nome_api": "Nome",
    "versao": "v1",
    "base_url": "https://...",
    "autenticacao": {"tipo": "api_key|bearer|oauth2"}
  },
  "endpoints": [
    {
      "metodo": "GET|POST|PUT|DELETE",
      "path": "/path",
      "nome": "Nome",
      "descricao": "Descrição",
      "categoria": "Categoria",
      "parametros": [
        {
          "nome": "param",
          "tipo": "string",
          "obrigatorio": true,
          "localizacao": "path|query|body|header",
          "descricao": "Desc",
          "exemplo": "valor"
        }
      ],
      "respostas": {
        "200": {"descricao": "OK", "schema": {}, "exemplo": {}}
      },
      "prioridade_teste": {
        "score": 95,
        "categoria": "CRITICO",
        "motivo": "Explicação clara"
      }
    }
  ]
}

REGRAS:
- prioridade_teste OBRIGATÓRIA
- Separe path/query/body/header
- Retorne APENAS JSON válido`;

    const llmData = await base44Instance.asServiceRole.integrations.Core.InvokeLLM({
      prompt: llmPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          metadados: { 
            type: "object",
            properties: {
              nome_api: { type: "string" },
              base_url: { type: "string" },
              autenticacao: { type: "object" }
            }
          },
          endpoints: { 
            type: "array",
            items: {
              type: "object",
              properties: {
                metodo: { type: "string" },
                path: { type: "string" },
                nome: { type: "string" },
                parametros: { type: "array" },
                prioridade_teste: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    categoria: { type: "string" },
                    motivo: { type: "string" }
                  },
                  required: ["score", "categoria", "motivo"]
                }
              },
              required: ["metodo", "path", "nome", "prioridade_teste"]
            }
          }
        },
        required: ["metadados", "endpoints"]
      }
    });

    await updateJob('ANALISANDO_IA', 50, 'IA concluiu análise', `${llmData.endpoints.length} endpoints encontrados`);
    await updateJob('COMPARANDO', 80, 'Comparando com endpoints existentes', 'Detectando duplicados');

    const endpointsExistentes = await base44Instance.asServiceRole.entities.EndpointAPI.filter({
      escritorio_id: analise.escritorio_id
    });

    const pendencias = [];
    const endpointsComStatus = llmData.endpoints.map(ep => {
      const duplicado = endpointsExistentes.find(
        e => e.path === ep.path && e.metodo === ep.metodo
      );

      if (!ep.schema_resposta || Object.keys(ep.schema_resposta).length === 0) {
        pendencias.push({
          endpoint_path: ep.path,
          tipo: 'SCHEMA_FALTANDO',
          mensagem: 'Schema de resposta não definido',
          sugestao_ia: 'Criar entity baseada no exemplo_resposta'
        });
      }

      if (!ep.parametros_obrigatorios || ep.parametros_obrigatorios.length === 0) {
        pendencias.push({
          endpoint_path: ep.path,
          tipo: 'PARAMETROS_INCOMPLETOS',
          mensagem: 'Parâmetros obrigatórios não identificados',
          sugestao_ia: 'Verificar documentação'
        });
      }

      if (duplicado) {
        const precisaAtualizar = 
          JSON.stringify(duplicado.parametros_obrigatorios) !== JSON.stringify(ep.parametros_obrigatorios) ||
          JSON.stringify(duplicado.schema_resposta) !== JSON.stringify(ep.schema_resposta);

        return {
          ...ep,
          status_comparacao: precisaAtualizar ? 'ATUALIZAR' : 'DUPLICADO',
          endpoint_existente_id: duplicado.id
        };
      }

      return { ...ep, status_comparacao: 'NOVO' };
    });

    await updateJob('COMPARANDO', 90, 'Finalizando análise', 'Salvando resultados');

    await base44Instance.asServiceRole.entities.DockerAnalise.update(analise.id, {
      status: 'CONCLUIDO',
      progresso_percentual: 100,
      total_endpoints_encontrados: endpointsComStatus.length,
      endpoints_extraidos: endpointsComStatus,
      metadados_extraidos: llmData.metadados,
      pendencias: pendencias,
      recomendacoes_schema: []
    });

    await updateJob('CONCLUIDO', 100, 'Análise concluída', `Total: ${endpointsComStatus.length} endpoints, ${pendencias.length} pendências`);

    await base44Instance.asServiceRole.entities.JobAnaliseDocker.update(jobId, {
      tempo_fim: new Date().toISOString(),
      total_endpoints_processados: endpointsComStatus.length,
      total_endpoints_estimado: endpointsComStatus.length
    });

  } catch (error) {
    console.error('Erro na análise:', error);
    
    await base44Instance.asServiceRole.entities.JobAnaliseDocker.update(jobId, {
      status: 'ERRO',
      erro_mensagem: error.message,
      tempo_fim: new Date().toISOString()
    });

    await base44Instance.asServiceRole.entities.DockerAnalise.update(analise.id, {
      status: 'ERRO',
      erro_mensagem: error.message,
      pode_recomecar: true
    });
  }
}