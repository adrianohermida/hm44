import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { addDays, addBusinessDays, format, isWeekend, parseISO } from 'npm:date-fns@3.0.0';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { 
      data_inicio, 
      dias_prazo, 
      tipo_contagem, 
      tipo_dias,
      tribunal, 
      escritorio_id 
    } = await req.json();
    
    if (!data_inicio || !dias_prazo || !escritorio_id) {
      return Response.json({ error: 'Parâmetros obrigatórios faltando' }, { status: 400 });
    }
    
    // 1. Buscar feriados aplicáveis
    const feriados = await base44.asServiceRole.entities.Feriado.filter({
      escritorio_id,
      $or: [
        { tipo: 'Feriado Nacional' },
        { tipo: 'Feriado Forense', tribunal: tribunal || '' }
      ]
    });
    
    // 2. Buscar regra aplicável
    const regras = await base44.asServiceRole.entities.RegraPrazo.filter({
      escritorio_id,
      tipo_contagem: tipo_contagem || 'Disponibilização DJE',
      ativa: true
    });
    
    // 3. Calcular data base conforme tipo de contagem
    let dataBase = parseISO(data_inicio);
    
    switch (tipo_contagem) {
      case 'Disponibilização DJE':
        dataBase = addDays(dataBase, 1); // Dia seguinte
        break;
      case 'Intimação SAJ':
        dataBase = addDays(dataBase, 10); // +10 dias corridos
        break;
      case 'Citação SAJ':
        dataBase = addBusinessDays(dataBase, 5); // +5 dias úteis
        break;
      case 'Juntada de mandado':
        // Mesma data
        break;
      default:
        dataBase = addDays(dataBase, 1);
    }
    
    // 4. Calcular dias conforme tipo (úteis ou corridos)
    let vencimento = dataBase;
    
    if (tipo_dias === 'Dias Corridos') {
      // Simplesmente adiciona dias
      vencimento = addDays(dataBase, parseInt(dias_prazo));
    } else {
      // Dias Úteis - pular fins de semana e feriados
      const feriadosDatas = feriados.map(f => f.data);
      let diasRestantes = parseInt(dias_prazo);
      
      while (diasRestantes > 0) {
        vencimento = addDays(vencimento, 1);
        
        const dataStr = format(vencimento, 'yyyy-MM-dd');
        const ehFeriado = feriadosDatas.includes(dataStr);
        const ehFimDeSemana = isWeekend(vencimento);
        
        if (!ehFimDeSemana && !ehFeriado) {
          diasRestantes--;
        }
      }
    }
    
    // 5. Se vencimento cair em feriado/fim de semana, prorrogar
    const feriadosDatas = feriados.map(f => f.data);
    while (isWeekend(vencimento) || feriadosDatas.includes(format(vencimento, 'yyyy-MM-dd'))) {
      vencimento = addDays(vencimento, 1);
    }
    
    // 6. Atualizar estatísticas da regra usada
    if (regras[0]) {
      await base44.asServiceRole.entities.RegraPrazo.update(regras[0].id, {
        vezes_aplicada: (regras[0].vezes_aplicada || 0) + 1
      });
    }
    
    // 7. Calcular feriados considerados
    const feriadosConsiderados = feriados.filter(f => {
      const fData = parseISO(f.data);
      return fData >= parseISO(data_inicio) && fData <= vencimento;
    });
    
    return Response.json({
      success: true,
      data_vencimento: format(vencimento, 'yyyy-MM-dd'),
      feriados_considerados: feriadosConsiderados.map(f => ({
        data: f.data,
        descricao: f.descricao,
        tipo: f.tipo
      })),
      regra_aplicada: regras[0] ? {
        id: regras[0].id,
        nome: regras[0].nome,
        base_legal: regras[0].base_legal
      } : null,
      dias_calculados: dias_prazo,
      tipo_contagem: tipo_contagem
    });
    
  } catch (error) {
    console.error('Erro em calcularPrazoComFeriados:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});