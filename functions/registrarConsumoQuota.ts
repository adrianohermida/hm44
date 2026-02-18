import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Registra consumo de quota (YouTube API, Google APIs, etc)
 * e verifica limites diários
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
      provedor_id, 
      endpoint_id, 
      recurso, 
      metodo, 
      custo_quota,
      escritorio_id 
    } = body;

    if (!provedor_id || !recurso || !metodo || !custo_quota || !escritorio_id) {
      return Response.json({ 
        error: 'Campos obrigatórios: provedor_id, recurso, metodo, custo_quota, escritorio_id' 
      }, { status: 400 });
    }

    // Buscar ou criar monitor de quota
    const hoje = new Date().toISOString().split('T')[0];
    const monitors = await base44.asServiceRole.entities.QuotaMonitor.filter({
      escritorio_id,
      provedor_id,
      recurso,
      metodo
    });

    let monitor;
    if (monitors.length === 0) {
      // Criar novo monitor
      monitor = await base44.asServiceRole.entities.QuotaMonitor.create({
        escritorio_id,
        provedor_id,
        endpoint_id: endpoint_id || null,
        recurso,
        metodo,
        custo_quota,
        limite_diario: 10000, // Padrão YouTube
        quota_consumida_hoje: 0,
        total_chamadas_hoje: 0,
        data_reset: hoje,
        alerta_ativo: false,
        bloqueado: false
      });
    } else {
      monitor = monitors[0];
      
      // Verificar se precisa resetar (novo dia)
      if (monitor.data_reset !== hoje) {
        monitor = await base44.asServiceRole.entities.QuotaMonitor.update(monitor.id, {
          quota_consumida_hoje: 0,
          total_chamadas_hoje: 0,
          data_reset: hoje,
          alerta_ativo: false,
          bloqueado: false
        });
      }
    }

    // Verificar se está bloqueado
    if (monitor.bloqueado) {
      return Response.json({
        bloqueado: true,
        message: `Limite diário de quota atingido (${monitor.limite_diario} unidades)`,
        quota_consumida: monitor.quota_consumida_hoje,
        limite_diario: monitor.limite_diario,
        reset_em: monitor.data_reset
      }, { status: 429 });
    }

    // Simular consumo
    const nova_quota = monitor.quota_consumida_hoje + custo_quota;
    const novas_chamadas = monitor.total_chamadas_hoje + 1;
    const percent_usado = (nova_quota / monitor.limite_diario) * 100;

    // Verificar se atingiu threshold de alerta (80%)
    const threshold = monitor.threshold_alerta_percent || 80;
    const alerta_ativo = percent_usado >= threshold;
    
    // Verificar se atingiu limite (100%)
    const bloqueado = nova_quota >= monitor.limite_diario;

    // Atualizar monitor
    const monitorAtualizado = await base44.asServiceRole.entities.QuotaMonitor.update(monitor.id, {
      quota_consumida_hoje: nova_quota,
      total_chamadas_hoje: novas_chamadas,
      alerta_ativo,
      bloqueado
    });

    return Response.json({
      sucesso: true,
      bloqueado,
      alerta_ativo,
      quota_consumida: nova_quota,
      limite_diario: monitor.limite_diario,
      quota_disponivel: monitor.limite_diario - nova_quota,
      percent_usado: Math.round(percent_usado),
      custo_esta_chamada: custo_quota,
      total_chamadas_hoje: novas_chamadas,
      reset_em: hoje
    });

  } catch (error) {
    console.error('❌ Erro ao registrar consumo de quota:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});