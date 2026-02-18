// Monitora jobs travados e marca como falhou após timeout
export async function monitorarTimeouts(base44) {
  const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos
  
  const jobsProcessando = await base44.asServiceRole.entities.JobImportacao.filter({
    status: 'processando'
  });

  for (const job of jobsProcessando) {
    if (!job.tempo_inicio) continue;

    const inicio = new Date(job.tempo_inicio).getTime();
    const agora = Date.now();
    const decorrido = agora - inicio;

    if (decorrido > TIMEOUT_MS) {
      console.log(`[TimeoutMonitor] Job ${job.id} travado há ${Math.floor(decorrido / 60000)}min`);
      
      await base44.asServiceRole.entities.JobImportacao.update(job.id, {
        status: 'falhou',
        erro_mensagem: 'Timeout: processamento excedeu 5 minutos',
        tempo_conclusao: new Date().toISOString()
      });

      await base44.asServiceRole.entities.Notificacao.create({
        escritorio_id: job.escritorio_id,
        user_email: job.user_email,
        tipo: 'importacao_falhou',
        titulo: '⏱️ Importação expirou',
        mensagem: 'Processamento travado após 5 minutos. Tente novamente com lotes menores.',
        lida: false
      });
    }
  }
}