/**
 * API Client Centralizado - Módulo de Conectores
 * 
 * Funções utilitárias para fazer chamadas a APIs externas com:
 * - Autenticação centralizada (secrets + app connectors)
 * - Tratamento uniforme de erros
 * - Logging automático (LogRequisicaoAPI)
 * - Registro de consumo (ConsumoAPIExterna)
 * - Validação de parâmetros
 */

/**
 * Valida parâmetros de entrada
 * @param {Object} parametros - Parâmetros fornecidos
 * @param {Array} obrigatorios - Lista de parâmetros obrigatórios
 * @param {Array} opcionais - Lista de parâmetros opcionais
 * @returns {Object} { valido: boolean, erros: string[] }
 */
export function validateParams(parametros, obrigatorios = [], opcionais = []) {
  const erros = [];
  
  if (!parametros || typeof parametros !== 'object') {
    return { valido: false, erros: ['Parâmetros devem ser um objeto'] };
  }

  // Validar obrigatórios
  for (const param of obrigatorios) {
    if (!(param in parametros) || parametros[param] === null || parametros[param] === undefined || parametros[param] === '') {
      erros.push(`Parâmetro obrigatório ausente: ${param}`);
    }
  }

  // Validar parâmetros não permitidos
  const permitidos = [...obrigatorios, ...opcionais];
  for (const key in parametros) {
    if (!permitidos.includes(key)) {
      erros.push(`Parâmetro não reconhecido: ${key}`);
    }
  }

  return { valido: erros.length === 0, erros };
}

/**
 * Constrói URL completa com query params para GET
 * @param {string} baseUrl - URL base
 * @param {string} path - Path do endpoint
 * @param {string} metodo - Método HTTP
 * @param {Object} parametros - Parâmetros
 * @returns {string} URL completa
 */
/**
 * FASE 5: Função compartilhada para construir informações completas da chamada API
 * Usada tanto para execução real (makeAPICall) quanto para preview (CopyAPICallButton)
 * Garante que o cURL copiado é IDÊNTICO ao executado
 */
export function buildAPICallInfo({ endpoint, provedor, parametros = {}, maskSecret = false }) {
  const apiKeyConfig = provedor?.api_key_config || {};
  const secretName = apiKeyConfig.secret_name || provedor.secret_name || 'SECRET_NAO_CONFIGURADO';
  const secretValue = Deno.env.get(secretName) || 'SECRET_NAO_ENCONTRADO';
  const secretMasked = secretValue.length > 4 ? '***' + secretValue.slice(-4) : '***';
  const secretToUse = maskSecret ? secretMasked : secretValue;
  
  // Determinar base URL
  const baseUrl = endpoint.versao_api === 'V2' 
    ? (provedor.base_url_v2 || provedor.base_url_v1)
    : provedor.base_url_v1;

  // Preparar estruturas
  let url = `${baseUrl}${endpoint.path}`;
  const headers = {};
  let body = null;
  const queryParams = {};
  
  // AUTENTICAÇÃO: processar primeiro para determinar localização
  const authLocation = apiKeyConfig.query_param_name ? 'query' : 'header';
  const authParamName = apiKeyConfig.query_param_name || apiKeyConfig.header_name || 'Authorization';
  
  if (authLocation === 'query') {
    queryParams[authParamName] = secretToUse;
  } else {
    const prefix = apiKeyConfig.prefix || 'Bearer';
    headers[authParamName] = prefix ? `${prefix} ${secretToUse}` : secretToUse;
  }
  
  // PARÂMETROS: distribuir por localização
  const parametrosDef = endpoint.parametros || [];
  
  for (const [key, value] of Object.entries(parametros)) {
    if (value === null || value === undefined || value === '') continue;
    
    const paramDef = parametrosDef.find(p => p.nome === key);
    const localizacao = paramDef?.localizacao || 'query';
    
    if (localizacao === 'path') {
      url = url.replace(`{${key}}`, String(value));
    } else if (localizacao === 'header') {
      headers[key] = String(value);
    } else if (localizacao === 'body') {
      if (!body) body = {};
      body[key] = value;
    } else {
      // Default: query
      queryParams[key] = String(value);
    }
  }
  
  // Adicionar query params à URL
  if (Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }
  
  // Adicionar Content-Type se houver body
  if (body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  return {
    url,
    headers,
    body: body ? JSON.stringify(body) : null,
    metodo: endpoint.metodo,
    secretName,
    secretValue,
    secretMasked,
    authLocation
  };
}

export function buildURL(baseUrl, path, metodo, parametros = {}) {
  let url = `${baseUrl}${path}`;
  
  if (metodo === 'GET' && parametros && Object.keys(parametros).length > 0) {
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(parametros)) {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    }
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
}

// Função removida - lógica movida para makeAPICall

/**
 * Registra log de requisição em LogRequisicaoAPI
 * @param {Object} base44 - Cliente Base44
 * @param {Object} logData - Dados do log
 */
export async function registerLog(base44, logData) {
  try {
    await base44.asServiceRole.entities.LogRequisicaoAPI.create({
      escritorio_id: logData.escritorio_id,
      endpoint_id: logData.endpoint_id,
      provedor_id: logData.provedor_id,
      usuario_email: logData.usuario_email,
      metodo: logData.metodo,
      url_completa: logData.url_completa,
      headers_enviados: logData.headers_enviados || {},
      parametros_enviados: logData.parametros_enviados || {},
      body_enviado: logData.body_enviado || null,
      http_status: logData.http_status,
      tempo_resposta_ms: logData.tempo_resposta_ms,
      resposta_recebida: logData.resposta_recebida || {},
      sucesso: logData.sucesso,
      erro_mensagem: logData.erro_mensagem || null,
      tamanho_bytes: logData.tamanho_bytes || 0
    });
  } catch (error) {
    console.error('Erro ao registrar log:', error);
    // Não bloqueia a execução se falhar
  }
}

/**
 * Registra consumo em ConsumoAPIExterna
 * @param {Object} base44 - Cliente Base44
 * @param {Object} consumoData - Dados do consumo
 */
export async function registerConsumption(base44, consumoData) {
  try {
    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: consumoData.escritorio_id,
      provedor_id: consumoData.provedor_id,
      endpoint_id: consumoData.endpoint_id,
      usuario_email: consumoData.usuario_email,
      operacao: consumoData.operacao || 'teste',
      creditos_consumidos: consumoData.creditos_consumidos || 0,
      custo_estimado: consumoData.custo_estimado || 0,
      tempo_resposta_ms: consumoData.tempo_resposta_ms,
      sucesso: consumoData.sucesso,
      metadados: consumoData.metadados || {}
    });
  } catch (error) {
    console.error('Erro ao registrar consumo:', error);
    // Não bloqueia a execução se falhar
  }
}

/**
 * Faz chamada para API externa com logging e consumo automáticos
 * @param {Object} config - Configuração da chamada
 * @param {Object} config.base44 - Cliente Base44
 * @param {Object} config.endpoint - Objeto EndpointAPI
 * @param {Object} config.provedor - Objeto ProvedorAPI
 * @param {Object} config.escritorio - Objeto Escritorio
 * @param {string} config.usuario_email - Email do usuário
 * @param {Object} config.parametros - Parâmetros da chamada
 * @param {Object} config.headersAdicionais - Headers adicionais (opcional)
 * @returns {Promise<Object>} Resultado da chamada
 */
export async function makeAPICall(config) {
  const { 
    base44, 
    endpoint, 
    provedor, 
    escritorio, 
    usuario_email, 
    parametros = {},
    headersAdicionais = {}
  } = config;

  // Validação de entrada
  if (!provedor || !endpoint) {
    throw new Error('Provedor e Endpoint são obrigatórios');
  }

  // Determinar URL base
  const baseUrl = endpoint.versao_api === 'V2' ? provedor.base_url_v2 : provedor.base_url_v1;
  
  if (!baseUrl) {
    throw new Error(`URL base não configurada para versão ${endpoint.versao_api}`);
  }

  // Obter configuração de autenticação
  const apiKeyConfig = provedor.api_key_config || {};
  const secretName = apiKeyConfig.secret_name || provedor.secret_name;
  
  if (!secretName) {
    throw new Error('Secret não configurado no provedor. Configure em api_key_config.secret_name ou secret_name');
  }
  
  console.log('📋 Provedor:', {
    nome: provedor.nome,
    tipo_auth: provedor.tipo_autenticacao,
    api_key_config: apiKeyConfig,
    secret_name: secretName
  });

  // Obter valor real do secret
  const secretValue = Deno.env.get(secretName);
  if (!secretValue) {
    throw new Error(`Secret ${secretName} não encontrado nas variáveis de ambiente`);
  }

  const secretMasked = '***' + secretValue.slice(-4);

  console.log('🔑 Autenticação:', {
    secretName,
    hasValue: !!secretValue,
    secretLength: secretValue.length,
    secretMasked,
    headerName: apiKeyConfig.header_name || 'Authorization',
    prefix: apiKeyConfig.prefix || 'Bearer',
    queryParam: apiKeyConfig.query_param_name
  });

  // Preparar parâmetros (incluir API key como query param se configurado)
  let finalParams = { ...parametros };
  const secretUsedInQueryParam = !!apiKeyConfig.query_param_name;
  
  // ETAPA B: Debug ANTES de adicionar secret ao finalParams
  console.log('📝 Parâmetros ANTES de adicionar secret:', {
    parametros_input: parametros,
    finalParams_antes: { ...finalParams },
    vai_adicionar_query_param: secretUsedInQueryParam,
    query_param_name: apiKeyConfig.query_param_name
  });
  
  if (secretUsedInQueryParam) {
    console.log(`🔑 ADICIONANDO secret ao query param: ${apiKeyConfig.query_param_name}`);
    console.log(`🔑 Secret value (primeiros 20 chars): ${secretValue.substring(0, 20)}...`);
    finalParams[apiKeyConfig.query_param_name] = secretValue;
    console.log(`✅ Secret ADICIONADO. Valor em finalParams['${apiKeyConfig.query_param_name}']: ${finalParams[apiKeyConfig.query_param_name].substring(0, 20)}...`);
  }
  
  // ETAPA B: Debug DEPOIS de adicionar secret
  console.log('📝 Parâmetros DEPOIS de adicionar secret:', {
    finalParams_keys: Object.keys(finalParams),
    finalParams_valores_masked: Object.fromEntries(
      Object.entries(finalParams).map(([k, v]) => [
        k, 
        typeof v === 'string' && v.length > 20 ? v.substring(0, 20) + '...' : v
      ])
    )
  });

  // Construir URL com debug
  console.log('🔨 Construindo URL com buildURL...');
  const url = buildURL(baseUrl, endpoint.path, endpoint.metodo, finalParams);
  
  console.log('🌐 URL construída:', {
    url_completa: url.replace(secretValue, secretMasked),
    url_length: url.length,
    contains_secret: url.includes(secretValue),
    metodo: endpoint.metodo
  });
  
  // Construir headers com secret real
  const headers = {
    'Content-Type': 'application/json',
    ...headersAdicionais
  };
  
  // Adicionar autenticação ao header se configurado
  if (!secretUsedInQueryParam) {
    const headerName = apiKeyConfig.header_name || 'Authorization';
    const prefix = apiKeyConfig.prefix || 'Bearer';
    const authValue = prefix ? `${prefix} ${secretValue}` : secretValue;
    headers[headerName] = authValue;
    console.log(`🔑 Secret adicionado ao header: ${headerName}`);
  }

  const options = {
    method: endpoint.metodo,
    headers
  };

  // Body apenas para métodos que não são GET/HEAD
  if (!['GET', 'HEAD'].includes(endpoint.metodo) && parametros && Object.keys(parametros).length > 0) {
    options.body = JSON.stringify(parametros);
  }

  console.log('🚀 API Call Final:', {
    metodo: endpoint.metodo,
    url: url.replace(secretValue, '***' + secretValue.slice(-4)),
    params_count: Object.keys(finalParams).length,
    params_keys: Object.keys(finalParams),
    provedor: provedor.nome,
    versao: endpoint.versao_api,
    headers_keys: Object.keys(headers),
    has_body: !!options.body
  });

  const startTime = Date.now();
  let response;
  let resposta;
  let sucesso = false;
  let erro_mensagem = null;

  try {
    // Fazer chamada
    response = await fetch(url, options);
    const tempo_ms = Date.now() - startTime;
    
    // Processar resposta
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      resposta = await response.json();
    } else {
      const text = await response.text();
      resposta = { text, _raw: true };
    }

    sucesso = response.ok;
    if (!sucesso) {
      erro_mensagem = resposta.message || resposta.error || `HTTP ${response.status}`;
    }

    const tamanho_bytes = JSON.stringify(resposta).length;

    // Registrar log
    await registerLog(base44, {
      escritorio_id: escritorio.id,
      endpoint_id: endpoint.id,
      provedor_id: provedor.id,
      usuario_email,
      metodo: endpoint.metodo,
      url_completa: url,
      headers_enviados: options.headers,
      parametros_enviados: parametros,
      body_enviado: options.body || null,
      http_status: response.status,
      tempo_resposta_ms: tempo_ms,
      resposta_recebida: resposta,
      sucesso,
      erro_mensagem,
      tamanho_bytes
    });

    // Registrar consumo
    await registerConsumption(base44, {
      escritorio_id: escritorio.id,
      provedor_id: provedor.id,
      endpoint_id: endpoint.id,
      usuario_email,
      operacao: 'chamada_api',
      creditos_consumidos: endpoint.creditos_consumidos || 1,
      custo_estimado: (endpoint.creditos_consumidos || 1) * 0.10,
      tempo_resposta_ms: tempo_ms,
      sucesso,
      http_status: response.status,
      parametros,
      metadados: {
        metodo: endpoint.metodo,
        path: endpoint.path,
        versao: endpoint.versao_api,
        http_status: response.status,
        provedor_nome: provedor.nome,
        endpoint_nome: endpoint.nome
      }
    });

    // Atualizar quota do provedor
    if (provedor.quota_config) {
      const hoje = new Date().toISOString().split('T')[0];
      const mesAtual = new Date().toISOString().substring(0, 7);
      
      const updates = {
        total_requisicoes: (provedor.total_requisicoes || 0) + 1
      };

      if (!provedor.quota_config.ultimo_reset_diario || provedor.quota_config.ultimo_reset_diario !== hoje) {
        updates['quota_config.consumo_dia_atual'] = 1;
        updates['quota_config.ultimo_reset_diario'] = hoje;
      } else {
        updates['quota_config.consumo_dia_atual'] = (provedor.quota_config.consumo_dia_atual || 0) + 1;
      }

      if (!provedor.quota_config.ultimo_reset_mensal || !provedor.quota_config.ultimo_reset_mensal.startsWith(mesAtual)) {
        updates['quota_config.consumo_mes_atual'] = 1;
        updates['quota_config.ultimo_reset_mensal'] = mesAtual;
      } else {
        updates['quota_config.consumo_mes_atual'] = (provedor.quota_config.consumo_mes_atual || 0) + 1;
      }

      const excedeuDiario = provedor.quota_config.limite_diario && updates['quota_config.consumo_dia_atual'] > provedor.quota_config.limite_diario;
      const excedeuMensal = provedor.quota_config.limite_mensal && updates['quota_config.consumo_mes_atual'] > provedor.quota_config.limite_mensal;
      
      if (excedeuDiario || excedeuMensal) {
        updates['quota_config.quota_excedida'] = true;
      }

      await base44.asServiceRole.entities.ProvedorAPI.update(provedor.id, updates);
    }

    // Mascarar secret para log (já definido acima)
    const urlMasked = url.replace(new RegExp(secretValue, 'g'), secretMasked);
    
    // Headers enviados mascarados
    const headersEnviadosMasked = {};
    for (const [key, value] of Object.entries(options.headers)) {
      headersEnviadosMasked[key] = typeof value === 'string' && value.includes(secretValue)
        ? value.replace(new RegExp(secretValue, 'g'), secretMasked)
        : value;
    }

    console.log('✅ Sucesso! Preparando resposta:', {
      sucesso,
      http_status: response.status,
      tempo_ms,
      tamanho_bytes
    });

    return {
      sucesso,
      tempo_ms,
      http_status: response.status,
      headers: Object.fromEntries(response.headers.entries()), // Headers RECEBIDOS
      resposta,
      tamanho_bytes,
      log_chamada: {
        metodo: endpoint.metodo,
        url_completa: urlMasked,
        versao_api: endpoint.versao_api,
        headers_enviados: headersEnviadosMasked,
        parametros_enviados: parametros,
        body_enviado: options.body || null,
        secret_usado: secretMasked,
        secret_name: secretName,
        auth_location: secretUsedInQueryParam ? 'query_param' : 'header'
      }
    };
  } catch (error) {
    const tempo_ms = Date.now() - startTime;
    
    console.error('❌ Erro na chamada API:', error);
    
    // Usar callInfo se disponível, senão gerar fallback
    const apiKeyConfig = provedor.api_key_config || {};
    const secretName = apiKeyConfig.secret_name || provedor.secret_name || 'SECRET_NAO_CONFIGURADO';
    const secretValue = Deno.env.get(secretName) || 'SECRET_NAO_ENCONTRADO';
    const secretMasked = secretValue.length > 4 ? '***' + secretValue.slice(-4) : '***';
    
    const baseUrl = endpoint.versao_api === 'V2' ? provedor.base_url_v2 : provedor.base_url_v1;
    const urlForLog = `${baseUrl}${endpoint.path}`;

    // Registrar log de erro
    await registerLog(base44, {
      escritorio_id: escritorio.id,
      endpoint_id: endpoint.id,
      provedor_id: provedor.id,
      usuario_email,
      metodo: endpoint.metodo,
      url_completa: urlForLog,
      headers_enviados: {},
      parametros_enviados: parametros,
      body_enviado: null,
      http_status: 500,
      tempo_resposta_ms: tempo_ms,
      resposta_recebida: { erro: error.message },
      sucesso: false,
      erro_mensagem: error.message,
      tamanho_bytes: 0
    });

    // Registrar consumo de falha
    await registerConsumption(base44, {
      escritorio_id: escritorio.id,
      provedor_id: provedor.id,
      endpoint_id: endpoint.id,
      usuario_email,
      operacao: 'chamada_api',
      creditos_consumidos: 0,
      custo_estimado: 0,
      tempo_resposta_ms: tempo_ms,
      sucesso: false,
      metadados: {
        erro: error.message,
        stack: error.stack
      }
    });

    return {
      sucesso: false,
      erro: error.message,
      tempo_ms,
      http_status: 500,
      headers: {},
      resposta: { erro: error.message },
      tamanho_bytes: 0,
      log_chamada: {
        metodo: endpoint.metodo,
        url_completa: urlForLog,
        versao_api: endpoint.versao_api,
        headers_enviados: {},
        parametros_enviados: parametros,
        body_enviado: null,
        secret_usado: secretMasked,
        secret_name: secretName,
        erro_detalhado: error.stack,
        auth_location: apiKeyConfig.query_param_name ? 'query_param' : 'header'
      }
    };
  }
}

/**
 * Padroniza resposta de erro para o frontend
 * @param {Error} error - Erro capturado
 * @param {Object} context - Contexto adicional
 * @returns {Response} Resposta JSON padronizada
 */
export function errorResponse(error, context = {}) {
  return Response.json({
    sucesso: false,
    erro: error.message,
    http_status: context.http_status || 500,
    tempo_ms: context.tempo_ms || 0,
    contexto: {
      erro_detalhado: error.stack,
      ...context
    }
  }, { status: 200 }); // Sempre retorna 200 para o frontend processar
}