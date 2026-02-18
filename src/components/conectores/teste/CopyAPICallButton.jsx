import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CopyAPICallButton({ endpoint, provedor, params }) {
  const [copied, setCopied] = React.useState(false);

  const generateAPICall = () => {
    if (!provedor || !endpoint) {
      return {
        curl: 'Provedor ou endpoint não encontrado',
        url: '',
        headers: {},
        params: {}
      };
    }

    // FASE 5: Replicar exatamente a lógica de buildAPICallInfo (frontend version)
    const baseUrl = endpoint.versao_api === 'V2' 
      ? (provedor.base_url_v2 || provedor.base_url_v1)
      : provedor.base_url_v1;
    
    if (!baseUrl) {
      return {
        curl: `URL base não configurada para ${endpoint.versao_api}`,
        url: '',
        headers: {},
        params: {}
      };
    }

    let url = `${baseUrl}${endpoint.path}`;
    
    // Processar autenticação (MESMA LÓGICA buildAPICallInfo)
    const apiKeyConfig = provedor?.api_key_config || {};
    const secretName = apiKeyConfig.secret_name || provedor.secret_name || 'SECRET_NAO_CONFIGURADO';
    const authLocation = apiKeyConfig.query_param_name ? 'query_param' : 'header';
    const authParamName = apiKeyConfig.query_param_name || apiKeyConfig.header_name || 'Authorization';
    const prefix = apiKeyConfig.prefix || 'Bearer';
    const secretMasked = '***Xy7a';
    
    const headers = {};
    const queryParams = {};
    let body = null;
    
    // AUTENTICAÇÃO PRIMEIRO (igual buildAPICallInfo linha 75-84)
    if (authLocation === 'query_param') {
      queryParams[authParamName] = secretMasked;
    } else {
      headers[authParamName] = prefix ? `${prefix} ${secretMasked}` : secretMasked;
    }
    
    // PARÂMETROS: distribuir por localização (igual buildAPICallInfo linha 86-106)
    const parametrosDef = endpoint.parametros || [];
    
    for (const [key, value] of Object.entries(params)) {
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
        // Default: query (igual buildAPICallInfo)
        queryParams[key] = String(value);
      }
    }
    
    // Query params na URL (igual buildAPICallInfo linha 108-112)
    if (Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      url += `?${queryString}`;
    }
    
    // Content-Type (igual buildAPICallInfo linha 114-117)
    if (body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Construir cURL
    let curl = `curl -X ${endpoint.metodo} '${url}'`;
    
    for (const [key, value] of Object.entries(headers)) {
      curl += ` \\\n  -H '${key}: ${value}'`;
    }
    
    if (body) {
      curl += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
    }

    return {
      curl,
      provedor_id: provedor.codigo_identificador || provedor.id,
      endpoint_id: endpoint.id,
      metodo: endpoint.metodo,
      url,
      headers,
      body,
      params: queryParams,
      auth_config: {
        secret_name: secretName,
        header_name: authParamName,
        prefix: prefix,
        location: authLocation
      }
    };
  };

  const handleCopy = () => {
    const apiCall = generateAPICall();
    
    const authInfo = `# Autenticação:
# - Secret: ${apiCall.auth_config.secret_name}
# - Localização: ${apiCall.auth_config.location}
# - ${apiCall.auth_config.location === 'query_param' ? 'Query Param' : 'Header'}: ${apiCall.auth_config.header_name}
${apiCall.auth_config.prefix ? `# - Prefix: ${apiCall.auth_config.prefix}` : ''}
# - Valor mascarado: ***Xy7a (últimos 4 dígitos)
`;

    const texto = `# Provedor: ${provedor?.nome || 'N/A'} (ID: ${apiCall.provedor_id})
# Endpoint: ${endpoint?.nome || 'N/A'} (ID: ${apiCall.endpoint_id})
# Versão: ${endpoint?.versao_api || 'N/A'}
${authInfo}
${apiCall.curl}

---
URL Completa: ${apiCall.url}
Método: ${apiCall.metodo}
Headers Enviados: ${JSON.stringify(apiCall.headers, null, 2)}
${Object.keys(apiCall.params).length > 0 ? `Query Params: ${JSON.stringify(apiCall.params, null, 2)}` : ''}
${apiCall.body ? `Body: ${JSON.stringify(apiCall.body, null, 2)}` : ''}`;

    navigator.clipboard.writeText(texto);
    setCopied(true);
    toast.success('✅ Chamada API copiada (idêntica à execução real)');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copiado!' : 'Copiar Chamada API'}
    </Button>
  );
}