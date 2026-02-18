import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Busca tabela de movimentos da API pública TPU do CNJ
    const response = await fetch('https://gateway.cloud.pje.jus.br/tpu/api/movimento', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API TPU retornou status ${response.status}`);
    }

    const movimentos = await response.json();

    // Verifica registros existentes
    const existentes = await base44.asServiceRole.entities.TabelaMovimentoCNJ.list('', 50000);
    const existentesMap = new Map(existentes.map(m => [m.codigo, m.id]));

    let criados = 0;
    let atualizados = 0;
    const batch = [];
    const BATCH_SIZE = 100;

    for (const mov of movimentos) {
      const registro = {
        codigo: String(mov.codigo || mov.cod_item),
        codigo_pai: mov.codigo_pai || mov.cod_item_pai ? String(mov.codigo_pai || mov.cod_item_pai) : undefined,
        nivel1: mov.nivel1 || mov.nome?.split(' > ')[0],
        nivel2: mov.nivel2 || mov.nome?.split(' > ')[1],
        nivel3: mov.nivel3 || mov.nome?.split(' > ')[2],
        nivel4: mov.nivel4,
        nivel5: mov.nivel5,
        nivel6: mov.nivel6,
        glossario: mov.glossario || mov.dscGlossario,
        dispositivo_legal: mov.dispositivo_legal,
        artigo: mov.artigo,
        sigla: mov.sigla,
        versao_tpu: mov.versao || new Date().toISOString().split('T')[0],
        dt_publicacao: mov.dt_publicacao,
        dt_alteracao: mov.dt_alteracao,
        dt_inativacao: mov.dt_inativacao,
        ativo: !mov.dt_inativacao
      };

      if (existentesMap.has(registro.codigo)) {
        // Atualiza se necessário
        await base44.asServiceRole.entities.TabelaMovimentoCNJ.update(
          existentesMap.get(registro.codigo),
          registro
        );
        atualizados++;
      } else {
        batch.push(registro);
      }

      if (batch.length >= BATCH_SIZE) {
        await base44.asServiceRole.entities.TabelaMovimentoCNJ.bulkCreate(batch);
        criados += batch.length;
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      await base44.asServiceRole.entities.TabelaMovimentoCNJ.bulkCreate(batch);
      criados += batch.length;
    }

    return Response.json({
      sucesso: true,
      total_api: movimentos.length,
      criados,
      atualizados,
      total_final: existentes.length + criados
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});