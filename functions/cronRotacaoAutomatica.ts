import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const inicio = new Date();
  let execId = null;

  try {
    const base44 = createClientFromRequest(req);

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    if (escritorioId) {
      execId = (await base44.asServiceRole.entities.CronExecution.create({
        escritorio_id: escritorioId,
        cron_name: 'cronRotacaoAutomatica',
        status: 'executando',
        inicio: inicio.toISOString(),
        logs: ['Verificando rotações agendadas...']
      })).id;
    }

    const agora = new Date();
    const rotacoesAgendadas = await base44.asServiceRole.entities.SecretRotation.filter({
      status: 'agendada'
    });

    const executadas = [];
    const falhas = [];

    for (const rotacao of rotacoesAgendadas) {
      const dataAgendada = new Date(rotacao.data_agendada);
      
      if (dataAgendada <= agora) {
        try {
          await base44.asServiceRole.entities.SecretRotation.update(rotacao.id, {
            status: 'executando',
            data_execucao: new Date().toISOString()
          });

          const secretValue = Deno.env.get(rotacao.secret_name);
          
          if (!secretValue) {
            throw new Error(`Secret ${rotacao.secret_name} não encontrado`);
          }

          const hashAnterior = await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(secretValue)
          );
          const hashHex = Array.from(new Uint8Array(hashAnterior))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

          await base44.asServiceRole.entities.SecretRotation.update(rotacao.id, {
            status: 'concluida',
            valor_anterior_hash: hashHex
          });

          for (const provedorId of rotacao.provedores_afetados || []) {
            await base44.asServiceRole.entities.ProvedorAPI.update(provedorId, {
              saude_status: 'Desconhecido',
              ultima_verificacao: new Date().toISOString()
            });
          }

          executadas.push(rotacao.secret_name);

        } catch (error) {
          await base44.asServiceRole.entities.SecretRotation.update(rotacao.id, {
            status: 'falhou',
            erro_mensagem: error.message
          });
          falhas.push({ secret: rotacao.secret_name, erro: error.message });
        }
      }
    }

    const fim = new Date();

    if (execId) {
      await base44.asServiceRole.entities.CronExecution.update(execId, {
        status: 'sucesso',
        fim: fim.toISOString(),
        duracao_ms: fim - inicio,
        logs: [
          `Rotações verificadas: ${rotacoesAgendadas.length}`,
          `Executadas: ${executadas.length}`,
          `Falhas: ${falhas.length}`
        ]
      });
    }

    return Response.json({
      sucesso: true,
      total_verificadas: rotacoesAgendadas.length,
      executadas,
      falhas
    });

  } catch (error) {
    console.error('Erro no cron de rotação:', error);

    if (execId) {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.CronExecution.update(execId, {
        status: 'erro',
        fim: new Date().toISOString(),
        duracao_ms: new Date() - inicio,
        erro_mensagem: error.message
      });
    }

    return Response.json({
      sucesso: false,
      erro: error.message
    }, { status: 500 });
  }
});