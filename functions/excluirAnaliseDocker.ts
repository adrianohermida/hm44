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

    console.log(`[Excluir ${analise_id}] Requisição de ${user.email}`);

    // Buscar análise
    const analises = await base44.asServiceRole.entities.DockerAnalise.filter({ id: analise_id });
    if (!analises.length) {
      console.error(`[Excluir ${analise_id}] Análise não encontrada`);
      return Response.json({ error: 'Análise não encontrada' }, { status: 404 });
    }

    const analise = analises[0];

    // Verificar permissão (admin ou owner)
    if (user.role !== 'admin' && analise.created_by !== user.email) {
      console.error(`[Excluir ${analise_id}] Sem permissão - User: ${user.email}, Owner: ${analise.created_by}`);
      return Response.json({ error: 'Sem permissão para excluir esta análise' }, { status: 403 });
    }

    console.log(`[Excluir ${analise_id}] Permissão OK - Deletando jobs associados`);

    // Deletar jobs associados
    const jobs = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id });
    for (const job of jobs) {
      await base44.asServiceRole.entities.JobAnaliseDocker.delete(job.id);
      console.log(`[Excluir ${analise_id}] Job ${job.id} deletado`);
    }

    // Deletar análise
    await base44.asServiceRole.entities.DockerAnalise.delete(analise_id);
    console.log(`[Excluir ${analise_id}] ✅ Análise deletada`);

    return Response.json({ 
      success: true, 
      message: 'Análise excluída com sucesso'
    });

  } catch (error) {
    console.error('[Excluir] Erro crítico:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});