import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verifica autenticação admin
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ 
        error: 'Acesso negado. Apenas administradores.' 
      }, { status: 403 });
    }

    // Buscar o escritório correto dinamicamente
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorios || escritorios.length === 0) {
      return Response.json({ 
        error: 'Nenhum escritório encontrado' 
      }, { status: 404 });
    }
    
    const ESCRITORIO_ID_CORRETO = escritorios[0].id;
    console.log(`📌 Escritório correto: ${ESCRITORIO_ID_CORRETO}`);
    
    // Atualizar todos os usuários para o escritório correto
    const usuarios = await base44.asServiceRole.entities.User.list();
    console.log(`Atualizando ${usuarios.length} usuários...`);
    
    for (const usuario of usuarios) {
      if (usuario.escritorio_id !== ESCRITORIO_ID_CORRETO) {
        await base44.asServiceRole.entities.User.update(usuario.id, {
          escritorio_id: ESCRITORIO_ID_CORRETO
        });
        console.log(`✅ Usuário ${usuario.email} atualizado`);
      }
    }
    
    // Lista TODOS os processos (máximo possível)
    const todosProcessos = await base44.asServiceRole.entities.Processo.list('-created_date', 10000);
    
    const stats = {
      total: todosProcessos.length,
      corretos: 0,
      corrigidos: 0,
      erros: [],
      idsAjustados: 0
    };

    // Verifica e corrige escritorio_id
    for (const processo of todosProcessos) {
      try {
        let needsUpdate = false;
        const updateData = {};

        // Verifica escritorio_id
        if (processo.escritorio_id !== ESCRITORIO_ID_CORRETO) {
          updateData.escritorio_id = ESCRITORIO_ID_CORRETO;
          needsUpdate = true;
        } else {
          stats.corretos++;
        }

        if (needsUpdate) {
          // Só atualiza escritorio_id
          await base44.asServiceRole.entities.Processo.update(
            processo.id,
            updateData
          );
          stats.corrigidos++;
        }
      } catch (error) {
        stats.erros.push({
          processo_id: processo.id,
          numero_cnj: processo.numero_cnj,
          erro: error.message
        });
      }
    }

    // Log final detalhado
    console.log('📊 RESULTADO FINAL:', {
      total: stats.total,
      corretos: stats.corretos,
      corrigidos: stats.corrigidos,
      idsAjustados: stats.idsAjustados,
      erros: stats.erros.length
    });

    return Response.json({
      success: true,
      mensagem: `✅ Correção concluída: ${stats.corrigidos} processos corrigidos (${stats.idsAjustados} IDs ajustados), ${stats.corretos} já corretos.`,
      stats,
      usuarios_atualizados: usuarios.length,
      escritorio_id_padrao: ESCRITORIO_ID_CORRETO
    });

  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});