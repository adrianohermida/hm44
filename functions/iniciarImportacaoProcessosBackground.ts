import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nome, cpf_cnpj, escritorio_id, quantidade_processos = 500 } = await req.json();

    if (!nome || !escritorio_id) {
      return Response.json({
        error: 'Nome e escritorio_id são obrigatórios'
      }, { status: 400 });
    }

    // Criar job de importação
    const job = await base44.asServiceRole.entities.JobImportacao.create({
      escritorio_id,
      tipo: 'busca_tribunal',
      status: 'pendente',
      progresso: 0,
      total_itens: 0,
      itens_processados: 0,
      itens_importados: 0,
      itens_duplicados: 0,
      itens_erro: 0,
      parametros: {
        nome,
        cpf_cnpj,
        quantidade_processos
      },
      usuario_email: user.email,
      mensagem: 'Aguardando início...'
    });

    // Criar notificação
    await base44.asServiceRole.entities.Notificacao.create({
      escritorio_id,
      usuario_email: user.email,
      tipo: 'importacao_iniciada',
      titulo: 'Busca no Tribunal Iniciada',
      mensagem: `Buscando processos de "${nome}" em segundo plano`,
      lida: false,
      metadata: {
        job_id: job.id,
        nome,
        tipo: 'busca_tribunal'
      }
    });

    // Invocar processamento em background (não espera)
    base44.asServiceRole.functions.invoke('processarImportacaoBackground', {
      job_id: job.id,
      nome,
      cpf_cnpj,
      escritorio_id,
      quantidade_processos,
      usuario_email: user.email
    }).catch(err => console.error('Erro ao invocar background:', err));

    return Response.json({
      success: true,
      job_id: job.id,
      message: 'Importação iniciada em segundo plano. Você será notificado quando concluir.'
    });

  } catch (error) {
    console.error('Erro iniciarImportacaoProcessosBackground:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});