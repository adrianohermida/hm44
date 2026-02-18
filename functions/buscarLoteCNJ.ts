import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorios || escritorios.length === 0) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }

    const escritorioId = escritorios[0].id;
    const { cnjs } = await req.json();

    if (!cnjs || !Array.isArray(cnjs) || cnjs.length === 0) {
      return Response.json({ error: 'Lista de CNJs obrigatória' }, { status: 400 });
    }

    if (cnjs.length > 40) {
      return Response.json({ error: 'Máximo de 40 CNJs por vez' }, { status: 400 });
    }

    const resultados = [];
    let adicionados = 0;
    let duplicados = 0;
    let erros = 0;

    for (const cnj of cnjs) {
      try {
        const cnjLimpo = limparCNJ(cnj);
        if (!cnjLimpo) {
          resultados.push({ cnj, status: 'erro', erro: 'CNJ inválido' });
          erros++;
          continue;
        }

        const existe = await base44.asServiceRole.entities.Processo.filter({ id: cnjLimpo });
        if (existe.length > 0) {
          resultados.push({ cnj: cnjLimpo, status: 'duplicado' });
          duplicados++;
          continue;
        }

        const dadosDatajud = await buscarNoDatajud(cnjLimpo);

        await base44.asServiceRole.entities.Processo.create({
          id: cnjLimpo,
          escritorio_id: escritorioId,
          numero_cnj: cnjLimpo,
          titulo: dadosDatajud?.titulo || cnjLimpo,
          tribunal: dadosDatajud?.tribunal || null,
          fonte_origem: 'BUSCA_LOTE_CNJ',
          sync_status: dadosDatajud?.sync_status || 'pending',
          cnj_enriquecido: dadosDatajud?.cnj_enriquecido || false,
          dados_completos_api: dadosDatajud?.dados_completos || null
        });

        resultados.push({ cnj: cnjLimpo, status: 'adicionado' });
        adicionados++;
      } catch (error) {
        resultados.push({ cnj, status: 'erro', erro: error.message });
        erros++;
      }
    }

    await base44.asServiceRole.entities.Notificacao.create({
      escritorio_id: escritorioId,
      user_email: user.email,
      tipo: 'busca_lote_concluida',
      titulo: '✅ Busca em lote concluída',
      mensagem: `${adicionados} processos adicionados, ${duplicados} duplicados, ${erros} erros`,
      lida: false
    });

    return Response.json({
      success: true,
      total: cnjs.length,
      adicionados,
      duplicados,
      erros,
      resultados
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function limparCNJ(valor) {
  if (!valor) return null;
  const limpo = String(valor).replace(/[^0-9]/g, '');
  if (limpo.length !== 20) return null;
  
  const dv = limpo.substring(7, 9);
  if (dv === '00' || parseInt(dv) > 99) return null;
  
  return limpo;
}

async function buscarNoDatajud(cnj) {
  try {
    const CNJParser = (await import('./utils/CNJParser.js')).default;
    const parsed = CNJParser.parseCNJ(cnj);
    
    if (!parsed.valido || !parsed.datajud) {
      return { sync_status: 'not_found', cnj_enriquecido: false };
    }

    const datajudToken = Deno.env.get('DATAJUD_API_TOKEN');
    if (!datajudToken) {
      return { sync_status: 'error', cnj_enriquecido: false };
    }

    const url = `https://api-publica.datajud.cnj.jus.br/${parsed.datajud.alias}/_search`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `APIKey ${datajudToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          match: { numeroProcesso: cnj }
        }
      })
    });

    if (!response.ok) {
      return { sync_status: 'error', cnj_enriquecido: false };
    }

    const data = await response.json();
    const hit = data.hits?.hits?.[0]?._source;

    if (!hit) {
      return { sync_status: 'not_found', cnj_enriquecido: false };
    }

    return {
      titulo: hit.classe?.nome || cnj,
      tribunal: parsed.tribunal_sigla,
      sync_status: 'synced',
      cnj_enriquecido: true,
      dados_completos: hit
    };
  } catch (error) {
    console.error('Erro busca DataJud:', error);
    return { sync_status: 'error', cnj_enriquecido: false };
  }
}