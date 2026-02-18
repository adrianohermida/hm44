import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const PRECOS_ESCAVADOR = [
  { titulo: 'Atualizar resumo IA', categoria: 'Resumo', valor: 0.08, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Atualização processo tribunal', categoria: 'Atualização Processual', valor: 0.10, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Atualização docs específicos', categoria: 'Atualização Processual', valor: 0.75, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Atualização + autos', categoria: 'Atualização Processual', valor: 1.50, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Atualização + docs públicos', categoria: 'Atualização Processual', valor: 0.20, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Processos por OAB', categoria: 'Consulta envolvidos', valor: 4.50, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Processos do envolvido', categoria: 'Consulta envolvidos', valor: 4.50, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Resumo advogado OAB', categoria: 'Consulta envolvidos', valor: 0.40, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Resumo envolvido', categoria: 'Consulta envolvidos', valor: 0.40, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Autos processo', categoria: 'Consulta por CNJ', valor: 0.18, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Capa processo', categoria: 'Consulta por CNJ', valor: 0.05, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Documentos públicos', categoria: 'Consulta por CNJ', valor: 0.06, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Envolvidos processo', categoria: 'Consulta por CNJ', valor: 0.05, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Movimentações processo', categoria: 'Consulta por CNJ', valor: 0.05, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Resumo processo IA', categoria: 'Resumo', valor: 0.05, versao: 'V2', modelo: 'por_uso' },
  { titulo: 'Monitoramento diário', categoria: 'Monitoramentos', valor: 1.76, versao: 'V2', modelo: 'por_mes' },
  { titulo: 'Monitoramento mensal', categoria: 'Monitoramentos', valor: 0.08, versao: 'V2', modelo: 'por_mes' },
  { titulo: 'Monitoramento semanal', categoria: 'Monitoramentos', valor: 0.32, versao: 'V2', modelo: 'por_mes' },
  { titulo: 'Monitoramento novos processos', categoria: 'Monitoramentos', valor: 2.20, versao: 'V2', modelo: 'por_mes' }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { escritorio_id } = await req.json();
    const existentes = await base44.asServiceRole.entities.PrecificacaoEndpoint.filter({ escritorio_id });
    
    const novos = PRECOS_ESCAVADOR.filter(p => 
      !existentes.some(e => e.titulo === p.titulo)
    ).map(p => ({
      escritorio_id,
      titulo: p.titulo,
      categoria: p.categoria,
      versao: p.versao,
      valor_referencia: p.valor,
      modelo_cobranca: p.modelo,
      margem_percentual: 30,
      margem_valor: 0,
      preco_venda: p.valor * 1.3,
      ativo: true
    }));

    if (novos.length > 0) {
      await base44.asServiceRole.entities.PrecificacaoEndpoint.bulkCreate(novos);
    }

    return Response.json({ importados: novos.length, total: PRECOS_ESCAVADOR.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});