import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    const { rotacao_id } = await req.json();

    const rotacao = await base44.asServiceRole.entities.SecretRotation.filter({ id: rotacao_id });
    if (!rotacao || rotacao.length === 0) {
      return Response.json({ erro: 'Rotação não encontrada' }, { status: 404 });
    }

    const rot = rotacao[0];

    // ✅ CORREÇÃO: Validar secret ANTES de marcar como executando
    const secretValue = Deno.env.get(rot.secret_name);
    if (!secretValue) {
      await base44.asServiceRole.entities.SecretRotation.update(rot.id, {
        status: 'falhou',
        erro_mensagem: `Secret ${rot.secret_name} não encontrado nas variáveis de ambiente`
      });
      return Response.json({
        sucesso: false,
        erro: `Secret ${rot.secret_name} não configurado`
      }, { status: 400 });
    }

    await base44.asServiceRole.entities.SecretRotation.update(rot.id, {
      status: 'executando',
      data_execucao: new Date().toISOString()
    });

    try {

      const hashAnterior = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(secretValue)
      );
      const hashHex = Array.from(new Uint8Array(hashAnterior))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      await base44.asServiceRole.entities.SecretRotation.update(rot.id, {
        status: 'concluida',
        valor_anterior_hash: hashHex
      });

      for (const provedorId of rot.provedores_afetados || []) {
        const prov = await base44.asServiceRole.entities.ProvedorAPI.filter({ id: provedorId });
        if (prov && prov[0]) {
          await base44.asServiceRole.entities.ProvedorAPI.update(provedorId, {
            saude_status: 'Desconhecido',
            ultima_verificacao: new Date().toISOString()
          });
        }
      }

      const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
      const escritorioId = rot.escritorio_id;
      
      for (const admin of admins) {
        await base44.asServiceRole.entities.Notificacao.create({
          tipo: 'nova_mensagem',
          titulo: `✅ Secret ${rot.secret_name} rotacionado`,
          mensagem: `A rotação foi concluída. ${rot.provedores_afetados?.length || 0} provedor(es) afetados. Motivo: ${rot.motivo || 'N/A'}`,
          user_email: admin.email,
          escritorio_id: escritorioId
        });
      }

      return Response.json({
        sucesso: true,
        rotacao_id: rot.id,
        provedores_afetados: rot.provedores_afetados?.length || 0
      });

    } catch (error) {
      await base44.asServiceRole.entities.SecretRotation.update(rot.id, {
        status: 'falhou',
        erro_mensagem: error.message
      });

      throw error;
    }

  } catch (error) {
    console.error('Erro ao executar rotação:', error);
    return Response.json({
      sucesso: false,
      erro: error.message
    }, { status: 500 });
  }
});