import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { registerLog, registerConsumption } from './utils/apiClient.js';

/**
 * Registra consumo de API e log de requisição
 * Pode ser chamado manualmente por outras functions ou frontend
 * NOTA: Admin pode registrar para qualquer escritório, user apenas para o seu
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      escritorio_id,
      endpoint_id,
      provedor_id,
      metodo,
      url_completa,
      headers_enviados,
      parametros_enviados,
      body_enviado,
      http_status,
      tempo_resposta_ms,
      resposta_recebida,
      sucesso,
      erro_mensagem,
      tamanho_bytes,
      creditos_consumidos,
      custo_estimado,
      operacao
    } = body;

    // Validações básicas
    if (!escritorio_id || !endpoint_id || !provedor_id) {
      return Response.json({ 
        error: 'escritorio_id, endpoint_id e provedor_id são obrigatórios' 
      }, { status: 400 });
    }

    // Validação multi-tenant: user só pode registrar para seu escritório
    if (user.role !== 'admin' || user.email !== 'adrianohermida@gmail.com') {
      const escritorios = await base44.asServiceRole.entities.Escritorio.filter({ 
        created_by: user.email 
      });
      if (!escritorios.length || escritorios[0].id !== escritorio_id) {
        return Response.json({ 
          error: 'Você não tem permissão para registrar consumo neste escritório' 
        }, { status: 403 });
      }
    }

    // Registrar log de requisição
    await registerLog(base44, {
      escritorio_id,
      endpoint_id,
      provedor_id,
      usuario_email: user.email,
      metodo: metodo || 'GET',
      url_completa: url_completa || '',
      headers_enviados: headers_enviados || {},
      parametros_enviados: parametros_enviados || {},
      body_enviado: body_enviado || null,
      http_status: http_status || 0,
      tempo_resposta_ms: tempo_resposta_ms || 0,
      resposta_recebida: resposta_recebida || {},
      sucesso: sucesso !== false,
      erro_mensagem: erro_mensagem || null,
      tamanho_bytes: tamanho_bytes || 0
    });

    // Registrar consumo
    await registerConsumption(base44, {
      escritorio_id,
      provedor_id,
      endpoint_id,
      usuario_email: user.email,
      operacao: operacao || 'manual',
      creditos_consumidos: creditos_consumidos || 1,
      custo_estimado: custo_estimado || 0.10,
      tempo_resposta_ms: tempo_resposta_ms || 0,
      sucesso: sucesso !== false,
      metadados: {
        metodo,
        url_completa,
        http_status
      }
    });

    return Response.json({
      sucesso: true,
      mensagem: 'Consumo registrado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao registrar consumo:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});