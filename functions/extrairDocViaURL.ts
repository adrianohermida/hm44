import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, tipo_fonte, titulo } = await req.json();

    if (!url) {
      return Response.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    // Buscar escritório
    const todosEscritorios = await base44.asServiceRole.entities.Escritorio.list();
    if (!todosEscritorios.length) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }
    const escritorio = todosEscritorios[0];

    // Criar análise
    const analise = await base44.asServiceRole.entities.DockerAnalise.create({
      escritorio_id: escritorio.id,
      titulo: titulo || `Análise de ${url}`,
      tipo_fonte: tipo_fonte || 'URL_CUSTOM',
      url_documentacao: url,
      status: 'PENDENTE',
      progresso_percentual: 0,
      pode_recomecar: false,
      tentativas: 0,
      ultima_atualizacao: new Date().toISOString()
    });

    // Criar job
    const job = await base44.asServiceRole.entities.JobAnaliseDocker.create({
      escritorio_id: escritorio.id,
      analise_id: analise.id,
      status: 'PENDENTE',
      progresso_percentual: 0,
      etapa_atual: 'Aguardando processamento',
      logs: [{
        timestamp: new Date().toISOString(),
        etapa: 'INICIO',
        mensagem: 'Análise criada, aguardando processamento',
        progresso: 0,
        tipo: 'INFO'
      }],
      pode_recomecar: false,
      recomecos: 0
    });

    // Atualizar análise com job_id
    await base44.asServiceRole.entities.DockerAnalise.update(analise.id, {
      job_id: job.id
    });

    // Iniciar processamento assíncrono (não bloqueia resposta)
    setTimeout(() => {
      processarDocumentacao(analise.id, url, base44)
        .then(() => console.log(`Análise ${analise.id} concluída`))
        .catch(err => console.error(`Erro na análise ${analise.id}:`, err));
    }, 100);

    return Response.json({ 
      success: true, 
      analise_id: analise.id,
      job_id: job.id,
      message: 'Análise iniciada com sucesso'
    });

  } catch (error) {
    console.error('Erro:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});

async function processarDocumentacao(analiseId, url, base44) {
  const addLog = async (etapa, mensagem, progresso, tipo = 'INFO') => {
    const job = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id: analiseId });
    if (job.length) {
      const currentLogs = job[0].logs || [];
      await base44.asServiceRole.entities.JobAnaliseDocker.update(job[0].id, {
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

    // Processar baseado no tipo
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
          // Postman Collection
          tipoDetectado = 'POSTMAN_COLLECTION';
          conteudoProcessado = JSON.stringify(json, null, 2);
          await addLog('DETECTADO', 'Postman Collection detectada', 25, 'SUCCESS');
        }
      } catch {}
    } else if (contentType.includes('yaml') || content.includes('swagger:') || content.includes('openapi:')) {
      tipoDetectado = 'OPENAPI_YAML';
      await addLog('DETECTADO', 'OpenAPI YAML detectado', 25, 'SUCCESS');
    } else if (content.includes('#%RAML') || content.includes('raml:')) {
      tipoDetectado = 'RAML';
      await addLog('DETECTADO', 'RAML detectado', 25, 'SUCCESS');
    } else if (content.includes('FORMAT: 1A') || content.includes('# API Blueprint')) {
      tipoDetectado = 'API_BLUEPRINT';
      await addLog('DETECTADO', 'API Blueprint detectado', 25, 'SUCCESS');
    } else if (contentType.includes('text/html')) {
      // Tentar extrair JSON embedded do Swagger UI
      const swaggerDataMatch = content.match(/spec:\s*({[\s\S]*?})\s*,/);
      if (swaggerDataMatch) {
        try {
          const json = JSON.parse(swaggerDataMatch[1]);
          tipoDetectado = 'SWAGGER_EMBEDDED';
          conteudoProcessado = JSON.stringify(json, null, 2);
          await addLog('DETECTADO', 'Swagger embedded no HTML extraído', 25, 'SUCCESS');
        } catch {}
      }
    }

    await addLog('EXTRAINDO_TEXTO', `Tipo: ${tipoDetectado} - Pronto para análise`, 30, 'SUCCESS');

    // Usar LLM para extrair endpoints
    await addLog('ANALISANDO_IA', 'Analisando documentação com IA', 50, 'INFO');
    
    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em engenharia reversa de APIs REST. Analise esta documentação e extraia TODOS os endpoints com o MÁXIMO de detalhes E PRIORIZE-OS para teste.

📄 TIPO: ${tipoDetectado}
📊 TAMANHO: ${conteudoProcessado.length} caracteres

DOCUMENTAÇÃO:
${conteudoProcessado.substring(0, 90000)}

🏆 **SISTEMA DE PRIORIZAÇÃO OBRIGATÓRIO** (PARA CADA ENDPOINT):

Você DEVE atribuir um score de prioridade 0-100 baseado na IMPORTÂNCIA para testes iniciais:

**SCORE 95-100 (CRÍTICO - Teste PRIMEIRO):**
- 🔑 Autenticação: /login, /auth, /token, /oauth/authorize, /refresh
- 🔐 Geração de API keys ou credenciais
- Motivo: "Pré-requisito para todos os outros endpoints - sem auth nada funciona"

**SCORE 80-94 (MUITO IMPORTANTE - Teste em SEGUNDO):**
- ➕ POST de recursos CORE: criar usuário, criar pedido, criar contrato, criar processo
- 🔍 GET de busca/search de recursos principais
- 💳 Operações de pagamento/checkout
- Motivo: "Operação core do negócio - funcionalidade principal da API"

**SCORE 60-79 (IMPORTANTE - Teste em TERCEIRO):**
- 📋 GET de listagem com paginação
- 📄 GET de detalhes de recursos
- ✏️ PUT/PATCH de atualização de recursos principais
- 📊 Relatórios e dashboards
- Motivo: "Funcionalidade frequentemente usada - validar comportamento"

**SCORE 40-59 (NORMAL - Teste DEPOIS):**
- 🗑️ DELETE de recursos
- 📤 Upload/download de arquivos
- ⚙️ Configurações e preferências
- 🔔 Notificações
- Motivo: "Funcionalidade complementar - não crítica inicialmente"

**SCORE 20-39 (BAIXA PRIORIDADE):**
- 🔄 Operações de sincronização
- 📈 Métricas e analytics
- 🏷️ Tags e categorização
- Motivo: "Funcionalidade auxiliar - testar após validar principais"

**SCORE 0-19 (OPCIONAL):**
- ❤️ Health checks (/health, /status, /ping)
- 🐛 Debug e diagnóstico
- 📚 Endpoints de documentação
- Motivo: "Não afeta funcionalidade principal - testar por último"

🎯 REGRAS DE PRIORIZAÇÃO:

1. **Dependências**: Se endpoint A depende de B, B tem score maior
2. **Frequência de uso**: Operações mais comuns = score maior
3. **Impacto no negócio**: Core business = score maior
4. **Integrações externas**: APIs de terceiros = score 75-85
5. **Webhooks/Callbacks**: Score 80-90 (são críticos para integrações)

📄 TIPO: ${tipoDetectado}
📊 TAMANHO: ${conteudoProcessado.length} caracteres

DOCUMENTAÇÃO:
${conteudoProcessado.substring(0, 90000)}

🎯 EXTRAIA COM PRIORIZAÇÃO INTELIGENTE:

1. **Base URL** e versão da API
2. **Autenticação** (tipo, header, formato)
3. **TODOS os endpoints** (métodos, paths completos)
4. **Parâmetros** separados por localização:
   - Path params: /users/{id} → id é path param
   - Query params: ?page=1&limit=10 → page e limit são query
   - Body params: dados enviados no POST/PUT
   - Headers: Authorization, Content-Type, etc
5. **Tipos de dados** (string, integer, boolean, array, object)
6. **Formatos especiais** (CPF, CNPJ, email, uuid, date, url)
7. **Validações** (required, min/max length, regex pattern)
8. **Respostas** (status 200, 400, 404, schema de resposta)
9. **Exemplos** reais de request/response
10. **Custos/Créditos** se mencionados

🏆 **PRIORIZAÇÃO OBRIGATÓRIA** (campo prioridade_teste):

Calcule score 0-100 para CADA endpoint baseado em:

**CRÍTICO (95-100):**
- Autenticação: /login, /auth, /token → "Necessário para acessar API"
- Refresh token: /refresh → "Mantém sessão ativa"

**MUITO IMPORTANTE (80-94):**
- POST principais: /users, /orders, /contracts → "Criação de recursos core"
- GET search: /search, /query → "Busca é funcionalidade mais usada"
- Integração externa: /webhooks, /callbacks → "Conecta sistemas"

**IMPORTANTE (60-79):**
- GET list: /users, /products → "Listagem de dados principais"
- GET details: /users/{id} → "Detalhes frequentemente acessados"
- PUT/PATCH: /users/{id} → "Atualização de recursos"

**NORMAL (40-59):**
- DELETE, uploads, configs → "Operações complementares"

**OPCIONAL (0-39):**
- /health, /status, /docs → "Não afeta funcionalidade"

**MOTIVO**: Explique em 1 frase clara POR QUE este score.

📦 ESTRUTURA JSON EXATA (COM PRIORIZAÇÃO OBRIGATÓRIA):
{
  "metadados": {
    "nome_api": "Nome completo",
    "versao": "v1",
    "base_url": "https://api.exemplo.com",
    "descricao": "Descrição do serviço",
    "autenticacao": {
      "tipo": "api_key|bearer|oauth2",
      "header": "X-API-Key ou Authorization",
      "formato": "Bearer {token}"
    }
  },
  "endpoints": [
    {
      "metodo": "GET|POST|PUT|DELETE|PATCH",
      "path": "/caminho/completo/{param}",
      "nome": "Nome descritivo",
      "descricao": "O que faz",
      "categoria": "Categoria",
      "parametros": [
        {
          "nome": "id",
          "tipo": "string|integer|boolean",
          "obrigatorio": true,
          "localizacao": "path|query|body|header",
          "descricao": "Descrição clara",
          "exemplo": "valor de exemplo",
          "formato": "cpf|cnpj|email|uuid|date",
          "validacao": {"min": 1, "max": 100, "pattern": "regex"}
        }
      ],
      "corpo_requisicao": {
        "content_type": "application/json",
        "schema": {"type": "object", "properties": {}},
        "exemplo": {}
      },
      "respostas": {
        "200": {
          "descricao": "Sucesso",
          "schema": {"type": "object"},
          "exemplo": {}
        },
        "400": {"descricao": "Erro", "exemplo": {}}
      },
      "prioridade_teste": {
        "score": 95,
        "categoria": "CRITICO",
        "motivo": "Autenticação é pré-requisito para acessar todos endpoints protegidos"
      }
    }
  ]
}

📊 **EXEMPLOS DE PRIORIZAÇÃO:**

/auth/login (POST):
  score: 98, categoria: "CRITICO", motivo: "Autenticação inicial necessária para gerar token de acesso"

/users (POST):
  score: 85, categoria: "IMPORTANTE", motivo: "Criação de usuários é operação core do sistema"

/users (GET):
  score: 75, categoria: "IMPORTANTE", motivo: "Listagem de usuários é consultada frequentemente"

/users/{id} (GET):
  score: 65, categoria: "NORMAL", motivo: "Detalhes de usuário específico têm uso moderado"

/users/{id} (PUT):
  score: 60, categoria: "NORMAL", motivo: "Atualização de dados é operação comum"

/users/{id} (DELETE):
  score: 45, categoria: "SECUNDARIO", motivo: "Remoção de usuários é operação menos frequente"

/health (GET):
  score: 15, categoria: "OPCIONAL", motivo: "Status da API não afeta funcionalidade principal"

⚠️ REGRAS OBRIGATÓRIAS:
- **PRIORIDADE_TESTE é OBRIGATÓRIA para TODOS os endpoints**
- NÃO omita nenhum endpoint
- Separe path/query/body params corretamente
- Identifique formatos BR (CPF: 11 dígitos, CNPJ: 14)
- Extraia TODOS status codes (200, 201, 400, 401, 404, 500)
- Se JSON: use campos "paths", "definitions", "components"
- Se YAML: procure por "paths:", "parameters:", "responses:"
- Se HTML: extraia de tabelas, listas, código de exemplo
- Se Postman: procure "item.request.method" e "item.request.url.path"
- Se RAML: procure recursos sob "/" e methods (get:, post:)
- Se API Blueprint: procure "## Resource" e "### Action"
- Calcule score baseado em: auth > POST core > GET search > GET list > GET detail > PUT > DELETE > admin
- Retorne APENAS JSON válido, SEM markdown`,
      response_json_schema: {
        type: "object",
        properties: {
          metadados: {
            type: "object",
            properties: {
              nome_api: { type: "string" },
              versao: { type: "string" },
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
      throw new Error('Nenhum endpoint foi extraído. Verifique se a URL contém documentação de API válida.');
    }
    
    await addLog('VALIDANDO', `✅ Extraídos ${dados.endpoints.length} endpoints com sucesso`, 70, 'SUCCESS');

    // Atualizar análise com endpoints
    await base44.asServiceRole.entities.DockerAnalise.update(analiseId, {
      status: 'PROCESSANDO',
      progresso_percentual: 70,
      total_endpoints_encontrados: dados.endpoints?.length || 0,
      endpoints_extraidos: dados.endpoints || [],
      metadados_extraidos: dados.metadados || {},
      ultima_atualizacao: new Date().toISOString()
    });

    await addLog('COMPARANDO', 'Comparando com endpoints existentes', 80, 'INFO');
    await addLog('CONCLUIDO', 'Análise concluída com sucesso', 100, 'SUCCESS');

    // Finalizar
    await base44.asServiceRole.entities.DockerAnalise.update(analiseId, {
      status: 'CONCLUIDO',
      progresso_percentual: 100,
      pode_recomecar: false,
      ultima_atualizacao: new Date().toISOString()
    });

    const job = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id: analiseId });
    if (job.length) {
      await base44.asServiceRole.entities.JobAnaliseDocker.update(job[0].id, {
        status: 'CONCLUIDO',
        progresso_percentual: 100,
        tempo_fim: new Date().toISOString()
      });
    }

  } catch (error) {
    await addLog('ERRO', `Erro: ${error.message}`, 0, 'ERROR');
    
    await base44.asServiceRole.entities.DockerAnalise.update(analiseId, {
      status: 'ERRO',
      erro_mensagem: error.message,
      pode_recomecar: true,
      ultima_atualizacao: new Date().toISOString()
    });

    const job = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id: analiseId });
    if (job.length) {
      await base44.asServiceRole.entities.JobAnaliseDocker.update(job[0].id, {
        status: 'ERRO',
        erro_mensagem: error.message,
        pode_recomecar: true
      });
    }
  }
}