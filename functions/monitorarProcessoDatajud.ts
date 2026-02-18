import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { processo_id, ativar } = await req.json();
    
    if (!processo_id) {
      return Response.json({ error: 'processo_id obrigatório' }, { status: 400 });
    }

    const processos = await base44.asServiceRole.entities.Processo.filter({ id: processo_id });
    const processo = processos[0];
    
    if (!processo) {
      return Response.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    // Buscar monitoramento existente
    const monitoramentos = await base44.asServiceRole.entities.MonitoramentoDatajud.filter({
      processo_id
    });

    if (ativar) {
      // Criar ou ativar monitoramento
      if (monitoramentos.length > 0) {
        await base44.asServiceRole.entities.MonitoramentoDatajud.update(monitoramentos[0].id, {
          ativo: true,
          proxima_verificacao: new Date().toISOString()
        });
      } else {
        await base44.asServiceRole.entities.MonitoramentoDatajud.create({
          escritorio_id: processo.escritorio_id,
          processo_id,
          numero_cnj: processo.numero_cnj,
          ativo: true,
          frequencia_horas: 24,
          proxima_verificacao: new Date().toISOString(),
          notificar_usuario: true
        });
      }
      
      return Response.json({ success: true, ativado: true });
    } else {
      // Desativar monitoramento
      if (monitoramentos.length > 0) {
        await base44.asServiceRole.entities.MonitoramentoDatajud.update(monitoramentos[0].id, {
          ativo: false
        });
      }
      
      return Response.json({ success: true, ativado: false });
    }

  } catch (error) {
    console.error('Erro em monitorarProcessoDatajud:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});