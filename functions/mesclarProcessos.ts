import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { processo_principal_id, processos_duplicados_ids } = await req.json();
    
    if (!processo_principal_id || !processos_duplicados_ids?.length) {
      return Response.json({ error: 'IDs inválidos' }, { status: 400 });
    }

    // 1. Verificar processo principal
    const allProcessos = await base44.asServiceRole.entities.Processo.list();
    const processoPrincipal = allProcessos.find(p => p.id === processo_principal_id);
    
    if (!processoPrincipal) {
      return Response.json({ error: 'Processo principal não encontrado' }, { status: 404 });
    }

    // 2. Transferir documentos anexados
    let documentos = [];
    try {
      const allDocumentos = await base44.asServiceRole.entities.DocumentoAnexado?.list?.() || [];
      documentos = allDocumentos.filter(d => d?.processo_id && processos_duplicados_ids.includes(d.processo_id));

      for (const doc of documentos) {
        try {
          await base44.asServiceRole.entities.DocumentoAnexado.update(doc.id, {
            processo_id: processo_principal_id
          });
        } catch (e) {
          console.log(`[Doc] Erro ao transferir ${doc.id}:`, e.message);
        }
      }
    } catch (e) {
      console.log('[Documentos] Entidade não existe ou erro:', e.message);
    }

    // 3. Transferir movimentações
    let movimentacoes = [];
    try {
      const allMovimentacoes = await base44.asServiceRole.entities.MovimentacaoProcesso?.list?.() || [];
      movimentacoes = allMovimentacoes.filter(m => m?.processo_id && processos_duplicados_ids.includes(m.processo_id));

      for (const mov of movimentacoes) {
        try {
          await base44.asServiceRole.entities.MovimentacaoProcesso.update(mov.id, {
            processo_id: processo_principal_id
          });
        } catch (e) {
          console.log(`[Mov] Erro ao transferir ${mov.id}:`, e.message);
        }
      }
    } catch (e) {
      console.log('[Movimentações] Entidade não existe ou erro:', e.message);
    }

    // 4. Transferir partes
    let partes = [];
    try {
      const allPartes = await base44.asServiceRole.entities.ProcessoParte?.list?.() || [];
      partes = allPartes.filter(p => p?.processo_id && processos_duplicados_ids.includes(p.processo_id));

      for (const parte of partes) {
        try {
          await base44.asServiceRole.entities.ProcessoParte.update(parte.id, {
            processo_id: processo_principal_id
          });
        } catch (e) {
          console.log(`[Parte] Erro ao transferir ${parte.id}:`, e.message);
        }
      }
    } catch (e) {
      console.log('[Partes] Entidade não existe ou erro:', e.message);
    }

    // 5. Transferir prazos, tarefas, audiências
    try {
      const allPrazos = await base44.asServiceRole.entities.PrazoProcesso?.list?.() || [];
      const prazos = allPrazos.filter(p => p?.processo_id && processos_duplicados_ids.includes(p.processo_id));

      for (const prazo of prazos) {
        try {
          await base44.asServiceRole.entities.PrazoProcesso.update(prazo.id, {
            processo_id: processo_principal_id
          });
        } catch (e) {
          console.log(`[Prazo] Erro ao transferir ${prazo.id}:`, e.message);
        }
      }
    } catch (e) {
      console.log('[Prazos] Entidade não existe ou erro:', e.message);
    }

    try {
      const allTarefas = await base44.asServiceRole.entities.TarefaProcesso?.list?.() || [];
      const tarefas = allTarefas.filter(t => t?.processo_id && processos_duplicados_ids.includes(t.processo_id));

      for (const tarefa of tarefas) {
        try {
          await base44.asServiceRole.entities.TarefaProcesso.update(tarefa.id, {
            processo_id: processo_principal_id
          });
        } catch (e) {
          console.log(`[Tarefa] Erro ao transferir ${tarefa.id}:`, e.message);
        }
      }
    } catch (e) {
      console.log('[Tarefas] Entidade não existe ou erro:', e.message);
    }

    // 6. Transferir documentos públicos
    try {
      const allDocsPublicos = await base44.asServiceRole.entities.DocumentoPublico?.list?.() || [];
      const docsPublicos = allDocsPublicos.filter(d => d?.processo_id && processos_duplicados_ids.includes(d.processo_id));

      for (const doc of docsPublicos) {
        try {
          await base44.asServiceRole.entities.DocumentoPublico.update(doc.id, {
            processo_id: processo_principal_id
          });
        } catch (e) {
          console.log(`[DocPublico] Erro ao transferir ${doc.id}:`, e.message);
        }
      }
    } catch (e) {
      console.log('[Docs Públicos] Entidade não existe ou erro:', e.message);
    }

    // 7. Excluir processos duplicados
    for (const id of processos_duplicados_ids) {
      await base44.asServiceRole.entities.Processo.delete(id);
    }

    return Response.json({ 
      success: true,
      processo_principal_id,
      documentos_transferidos: documentos?.length || 0,
      movimentacoes_transferidas: movimentacoes?.length || 0,
      partes_transferidas: partes?.length || 0,
      processos_removidos: processos_duplicados_ids.length
    });

  } catch (error) {
    console.error('[mesclarProcessos] Erro:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});