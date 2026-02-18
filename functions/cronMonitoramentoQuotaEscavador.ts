import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const [escritorio] = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorio) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }

    const [provedor] = await base44.asServiceRole.entities.ProvedorAPI.filter({
      nome: 'Escavador'
    });

    if (!provedor?.quota_config) {
      return Response.json({ error: 'Provedor sem quota_config' }, { status: 404 });
    }

    const hoje = new Date().toISOString().split('T')[0];
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Calcular consumo
    const consumos = await base44.asServiceRole.entities.ConsumoAPIExterna.filter({
      provedor_id: provedor.id,
      escritorio_id: escritorio.id
    });

    const consumoHoje = consumos
      .filter(c => c.created_date >= hoje)
      .reduce((sum, c) => sum + (c.creditos_consumidos || 0), 0);

    const consumoMes = consumos
      .filter(c => c.created_date >= inicioMes)
      .reduce((sum, c) => sum + (c.creditos_consumidos || 0), 0);

    const limiteDiario = provedor.quota_config.limite_diario || 1000;
    const limiteMensal = provedor.quota_config.limite_mensal || 30000;

    const percentDia = (consumoHoje / limiteDiario) * 100;
    const percentMes = (consumoMes / limiteMensal) * 100;

    const alertas = [];

    // Alerta diário 80%
    if (percentDia >= 80 && percentDia < 100) {
      alertas.push({
        tipo: 'quota_diaria_80',
        mensagem: `⚠️ Atenção: ${percentDia.toFixed(1)}% da quota diária consumida (${consumoHoje}/${limiteDiario} créditos)`,
        nivel: 'warning'
      });

      await base44.asServiceRole.entities.Notificacao.create({
        tipo: 'prazo_vencendo',
        titulo: 'Alerta: Quota Diária Escavador em 80%',
        mensagem: `${consumoHoje} de ${limiteDiario} créditos consumidos hoje`,
        user_email: 'adrianohermida@gmail.com',
        escritorio_id: escritorio.id,
        link: createPageUrl('MonitoramentoEscavador')
      });
    }

    // Alerta diário 100%
    if (percentDia >= 100) {
      alertas.push({
        tipo: 'quota_diaria_100',
        mensagem: `🚫 BLOQUEIO: Limite diário atingido (${consumoHoje}/${limiteDiario} créditos)`,
        nivel: 'critical'
      });

      await base44.asServiceRole.entities.Notificacao.create({
        tipo: 'prazo_vencido',
        titulo: '🚫 Quota Diária Escavador ESGOTADA',
        mensagem: `Limite de ${limiteDiario} créditos atingido. Novas consultas bloqueadas até amanhã.`,
        user_email: 'adrianohermida@gmail.com',
        escritorio_id: escritorio.id,
        link: createPageUrl('MonitoramentoEscavador')
      });
    }

    // Alerta mensal 80%
    if (percentMes >= 80 && percentMes < 100) {
      alertas.push({
        tipo: 'quota_mensal_80',
        mensagem: `⚠️ ${percentMes.toFixed(1)}% da quota mensal consumida (${consumoMes}/${limiteMensal} créditos)`,
        nivel: 'warning'
      });
    }

    // Alerta mensal 100%
    if (percentMes >= 100) {
      alertas.push({
        tipo: 'quota_mensal_100',
        mensagem: `🚫 Limite mensal atingido (${consumoMes}/${limiteMensal} créditos)`,
        nivel: 'critical'
      });
    }

    // Atualizar quota_config no provedor
    await base44.asServiceRole.entities.ProvedorAPI.update(provedor.id, {
      quota_config: {
        ...provedor.quota_config,
        consumo_dia_atual: consumoHoje,
        consumo_mes_atual: consumoMes,
        ultimo_reset_diario: hoje,
        quota_excedida: percentDia >= 100
      }
    });

    return Response.json({
      sucesso: true,
      consumo_hoje: consumoHoje,
      consumo_mes: consumoMes,
      limite_diario: limiteDiario,
      limite_mensal: limiteMensal,
      percent_dia: percentDia,
      percent_mes: percentMes,
      alertas
    });

  } catch (error) {
    return Response.json({
      sucesso: false,
      erro: error.message
    }, { status: 500 });
  }
});