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

    console.log(`[Recomeçar ${analise_id}] Requisição de ${user.email}`);

    // Buscar análise
    const analises = await base44.asServiceRole.entities.DockerAnalise.filter({ id: analise_id });
    if (!analises.length) {
      console.error(`[Recomeçar ${analise_id}] Análise não encontrada`);
      return Response.json({ error: 'Análise não encontrada' }, { status: 404 });
    }

    const analise = analises[0];

    // Verificar permissão (admin ou owner)
    if (user.role !== 'admin' && analise.created_by !== user.email) {
      console.error(`[Recomeçar ${analise_id}] Sem permissão - User: ${user.email}, Owner: ${analise.created_by}`);
      return Response.json({ error: 'Sem permissão para recomeçar esta análise' }, { status: 403 });
    }

    console.log(`[Recomeçar ${analise_id}] Permissão OK - Resetando status`);

    // Atualizar análise para PENDENTE
    await base44.asServiceRole.entities.DockerAnalise.update(analise_id, {
      status: 'PENDENTE',
      progresso_percentual: 0,
      erro_mensagem: null,
      pode_recomecar: false,
      tentativas: (analise.tentativas || 0) + 1,
      ultima_atualizacao: new Date().toISOString(),
      endpoints_extraidos: [],
      metadados_extraidos: {}
    });

    // Buscar e atualizar job
    const jobs = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id });
    let jobId = null;
    
    if (jobs.length) {
      const job = jobs[0];
      jobId = job.id;
      const currentLogs = job.logs || [];
      
      await base44.asServiceRole.entities.JobAnaliseDocker.update(job.id, {
        status: 'PENDENTE',
        progresso_percentual: 0,
        erro_mensagem: null,
        pode_recomecar: false,
        recomecos: (job.recomecos || 0) + 1,
        logs: [...currentLogs, {
          timestamp: new Date().toISOString(),
          etapa: 'RECOMECAR',
          mensagem: `Análise recomeçada por ${user.email} - Tentativa ${(analise.tentativas || 0) + 1}`,
          progresso: 0,
          tipo: 'INFO'
        }]
      });
    } else {
      // Criar novo job se não existe
      const newJob = await base44.asServiceRole.entities.JobAnaliseDocker.create({
        escritorio_id: analise.escritorio_id,
        analise_id: analise.id,
        status: 'PENDENTE',
        progresso_percentual: 0,
        etapa_atual: 'Aguardando reprocessamento',
        logs: [{
          timestamp: new Date().toISOString(),
          etapa: 'INICIO',
          mensagem: 'Job criado para reprocessamento',
          progresso: 0,
          tipo: 'INFO'
        }]
      });
      jobId = newJob.id;
    }

    console.log(`[Recomeçar ${analise_id}] Status resetado, Job: ${jobId}`);

    // Reiniciar processamento em background
    const url = analise.url_documentacao || analise.arquivo_url;
    if (url) {
      console.log(`[Recomeçar ${analise_id}] Iniciando processamento da URL: ${url}`);
      
      // Processar em background usando a mesma lógica de extrairDocViaURL
      setTimeout(() => {
        processarDocumentacao(analise_id, url, base44)
          .then(() => console.log(`[Recomeçar ${analise_id}] ✅ Concluído`))
          .catch(err => console.error(`[Recomeçar ${analise_id}] ❌ Erro:`, err));
      }, 100);
    } else {
      throw new Error('URL de documentação não encontrada');
    }

    return Response.json({ 
      success: true, 
      message: 'Análise recomeçada com sucesso',
      analise_id: analise.id,
      job_id: jobId,
      tentativa: (analise.tentativas || 0) + 1
    });

  } catch (error) {
    console.error('[Recomeçar] Erro crítico:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});

// FUNÇÃO DE PROCESSAMENTO (replicada de extrairDocViaURL)
async function processarDocumentacao(analiseId, url, base44) {
  const addLog = async (etapa, mensagem, progresso, tipo = 'INFO') => {
    const jobs = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id: analiseId });
    if (jobs.length) {
      const job = jobs[0];
      const currentLogs = job.logs || [];
      await base44.asServiceRole.entities.JobAnaliseDocker.update(job.id, {
        logs: [...currentLogs, {
          timestamp: new Date().toISOString(),
          etapa,
          mensagem,
          progresso,
          tipo
        }],
        progresso_percentual: progresso,
        etapa_atual: mensagem
      });
    }
  };

  try {
    await addLog('INICIADO', 'Extraindo conteúdo da URL', 10, 'INFO');
    
    // Buscar conteúdo da URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Base44DockerBot/1.0)',
        'Accept': 'application/json, text/html, application/yaml, */*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar URL: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    let content = await response.text();
    
    await addLog('EXTRAINDO_TEXTO', `Extraído ${content.length} chars - ${contentType}`, 20, 'SUCCESS');

    // Detectar tipo
    let tipoDetectado = 'HTML';
    let conteudoProcessado = content;
    
    if (contentType.includes('application/json') || content.trim().startsWith('{')) {
      try {
        const json = JSON.parse(content);
        if (json.swagger || json.openapi || json.paths) {
          tipoDetectado = 'SWAGGER_JSON';
          conteudoProcessado = JSON.stringify(json, null, 2);
          await addLog('DETECTADO', 'Swagger/OpenAPI JSON detectado', 25, 'SUCCESS');
        } else if (json.info && json.item) {
          tipoDetectado = 'POSTMAN_COLLECTION';
          conteudoProcessado = JSON.stringify(json, null, 2);
          await addLog('DETECTADO', 'Postman Collection detectada', 25, 'SUCCESS');
        }
      } catch {}
    } else if (contentType.includes('yaml') || content.includes('swagger:') || content.includes('openapi:')) {
      tipoDetectado = 'OPENAPI_YAML';
      await addLog('DETECTADO', 'OpenAPI YAML detectado', 25, 'SUCCESS');
    }

    await addLog('EXTRAINDO_TEXTO', `Tipo: ${tipoDetectado} - Pronto para análise`, 30, 'SUCCESS');

    // Usar LLM para extrair endpoints
    await addLog('ANALISANDO_IA', 'Analisando documentação com IA', 50, 'INFO');
    
    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em engenharia reversa de APIs REST. Analise esta documentação e extraia TODOS os endpoints com MÁXIMO de detalhes E PRIORIZE-OS para teste.

📄 TIPO: ${tipoDetectado}
📊 TAMANHO: ${conteudoProcessado.length} caracteres

DOCUMENTAÇÃO:
${conteudoProcessado.substring(0, 90000)}

🏆 PRIORIZAÇÃO OBRIGATÓRIA (campo prioridade_teste):

**CRÍTICO (95-100):** Autenticação (/login, /auth, /token) - "Pré-requisito para API"
**MUITO IMPORTANTE (80-94):** POST principais, webhooks - "Core business"
**IMPORTANTE (60-79):** GET list, GET details, PUT - "Operações frequentes"
**NORMAL (40-59):** DELETE, uploads - "Complementares"
**OPCIONAL (0-39):** /health, /docs - "Não afeta funcionalidade"

📦 RETORNE JSON:
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
      "path": "/path/{param}",
      "nome": "Nome endpoint",
      "descricao": "O que faz",
      "categoria": "Categoria",
      "parametros": [
        {
          "nome": "param",
          "tipo": "string",
          "obrigatorio": true,
          "localizacao": "path|query|body|header",
          "descricao": "Descrição",
          "exemplo": "valor"
        }
      ],
      "respostas": {
        "200": {"descricao": "Sucesso", "schema": {}, "exemplo": {}}
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
- TODOS endpoints DEVEM ter prioridade_teste
- Separe path/query/body/header params
- Extraia TODOS status codes
- Retorne APENAS JSON válido`,
      response_json_schema: {
        type: "object",
        properties: {
          metadados: { type: "object" },
          endpoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                metodo: { type: "string" },
                path: { type: "string" },
                nome: { type: "string" },
                parametros: { type: "array" },
                prioridade_teste: { type: "object" }
              }
            }
          }
        },
        required: ["metadados", "endpoints"]
      }
    });

    const dados = llmResult;
    
    if (!dados.endpoints || dados.endpoints.length === 0) {
      throw new Error('Nenhum endpoint extraído');
    }
    
    await addLog('VALIDANDO', `✅ ${dados.endpoints.length} endpoints extraídos`, 70, 'SUCCESS');

    // Atualizar análise
    await base44.asServiceRole.entities.DockerAnalise.update(analiseId, {
      status: 'CONCLUIDO',
      progresso_percentual: 100,
      total_endpoints_encontrados: dados.endpoints.length,
      endpoints_extraidos: dados.endpoints,
      metadados_extraidos: dados.metadados,
      pode_recomecar: false,
      ultima_atualizacao: new Date().toISOString()
    });

    await addLog('CONCLUIDO', 'Análise concluída', 100, 'SUCCESS');

    const jobsFinais = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id: analiseId });
    if (jobsFinais.length) {
      await base44.asServiceRole.entities.JobAnaliseDocker.update(jobsFinais[0].id, {
        status: 'CONCLUIDO',
        progresso_percentual: 100,
        tempo_fim: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error(`[Processar ${analiseId}] Erro:`, error);
    
    await addLog('ERRO', `Erro: ${error.message}`, 0, 'ERROR');
    
    await base44.asServiceRole.entities.DockerAnalise.update(analiseId, {
      status: 'ERRO',
      erro_mensagem: error.message,
      pode_recomecar: true,
      ultima_atualizacao: new Date().toISOString()
    });

    const jobsErro = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id: analiseId });
    if (jobsErro.length) {
      await base44.asServiceRole.entities.JobAnaliseDocker.update(jobsErro[0].id, {
        status: 'ERRO',
        erro_mensagem: error.message,
        pode_recomecar: true
      });
    }
  }
}