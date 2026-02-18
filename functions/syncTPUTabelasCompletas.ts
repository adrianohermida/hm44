import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { tipo } = await req.json();

    const endpoints = {
      movimentos: 'https://gateway.cloud.pje.jus.br/tpu/api/movimento',
      assuntos: 'https://gateway.cloud.pje.jus.br/tpu/api/assunto',
      classes: 'https://gateway.cloud.pje.jus.br/tpu/api/classe'
    };

    const entityMap = {
      movimentos: 'TabelaMovimentoCNJ',
      assuntos: 'TabelaAssuntoCNJ',
      classes: 'TabelaClasseCNJ'
    };

    const url = endpoints[tipo];
    const entityName = entityMap[tipo];

    if (!url || !entityName) {
      return Response.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    // Download com timeout estendido
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300000); // 5 minutos

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API TPU retornou status ${response.status}`);
    }

    const dados = await response.json();

    // Busca existentes
    const existentes = await base44.asServiceRole.entities[entityName].list('', 50000);
    const existentesMap = new Map(existentes.map(m => [m.codigo, m.id]));

    let criados = 0;
    let atualizados = 0;
    const BATCH_SIZE = 200;
    const batch = [];

    for (const item of dados) {
      const registro = {
        codigo: String(item.codigo || item.cod_item),
        codigo_pai: item.codigo_pai || item.cod_item_pai ? String(item.codigo_pai || item.cod_item_pai) : undefined,
        nivel1: item.nivel1 || item.nome?.split(' > ')[0],
        nivel2: item.nivel2 || item.nome?.split(' > ')[1],
        nivel3: item.nivel3 || item.nome?.split(' > ')[2],
        nivel4: item.nivel4,
        nivel5: item.nivel5,
        nivel6: item.nivel6,
        glossario: item.glossario || item.dscGlossario,
        dispositivo_legal: item.dispositivo_legal,
        artigo: item.artigo,
        sigla: item.sigla,
        versao_tpu: item.versao || new Date().toISOString().split('T')[0],
        dt_publicacao: item.dt_publicacao,
        dt_alteracao: item.dt_alteracao,
        dt_inativacao: item.dt_inativacao,
        ativo: !item.dt_inativacao
      };

      if (existentesMap.has(registro.codigo)) {
        await base44.asServiceRole.entities[entityName].update(
          existentesMap.get(registro.codigo),
          registro
        );
        atualizados++;
      } else {
        batch.push(registro);
      }

      if (batch.length >= BATCH_SIZE) {
        await base44.asServiceRole.entities[entityName].bulkCreate(batch);
        criados += batch.length;
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await base44.asServiceRole.entities[entityName].bulkCreate(batch);
      criados += batch.length;
    }

    return Response.json({
      sucesso: true,
      tipo,
      total_api: dados.length,
      criados,
      atualizados,
      total_final: existentes.length + criados
    });
  } catch (error) {
    return Response.json({ 
      error: error.message,
      stack: error.stack,
      name: error.name
    }, { status: 500 });
  }
});