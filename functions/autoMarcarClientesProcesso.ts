import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { processo_id } = await req.json();

    if (!processo_id) {
      return Response.json({ error: 'processo_id obrigatório' }, { status: 400 });
    }

    const processo = await base44.asServiceRole.entities.Processo.filter({ id: processo_id });
    if (!processo.length) {
      return Response.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    const escritorio_id = processo[0].escritorio_id;
    const partes = await base44.asServiceRole.entities.ProcessoParte.filter({ 
      processo_id 
    });

    let clientes_criados = 0;
    let partes_atualizadas = 0;

    for (const parte of partes) {
      const advogados = parte.advogados || [];
      const ehClienteEscritorio = advogados.some(adv => 
        adv.nome?.toLowerCase().includes('adriano') && 
        adv.nome?.toLowerCase().includes('menezes')
      );

      if (ehClienteEscritorio && !parte.e_cliente_escritorio) {
        let cliente_id = parte.cliente_id;
        let criado = false;

        if (!cliente_id && parte.cpf_cnpj) {
          const clientesExistentes = await base44.asServiceRole.entities.Cliente.filter({
            cpf_cnpj: parte.cpf_cnpj,
            escritorio_id
          });

          if (clientesExistentes.length > 0) {
            cliente_id = clientesExistentes[0].id;
          } else {
            const telefones = parte.advogados?.[0]?.telefone 
              ? [{ numero: parte.advogados[0].telefone, tipo: 'celular' }]
              : [];
            
            const novoCliente = await base44.asServiceRole.entities.Cliente.create({
              escritorio_id,
              nome_completo: parte.nome,
              cpf_cnpj: parte.cpf_cnpj,
              tipo_pessoa: parte.tipo_pessoa || 'fisica',
              telefones,
              origem: 'processo_automatico',
              status: 'ativo'
            });
            cliente_id = novoCliente.id;
            criado = true;
            clientes_criados++;
          }
        }

        await base44.asServiceRole.entities.ProcessoParte.update(parte.id, {
          e_cliente_escritorio: true,
          cliente_id
        });
        partes_atualizadas++;
      }
    }

    return Response.json({
      success: true,
      clientes_criados,
      partes_atualizadas,
      processo_id
    });

  } catch (error) {
    console.error('Erro autoMarcarClientesProcesso:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});