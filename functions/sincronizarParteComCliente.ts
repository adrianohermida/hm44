import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { parte_id, cliente_id } = await req.json();

    if (!parte_id || !cliente_id) {
      return Response.json({ 
        error: 'parte_id e cliente_id obrigatórios' 
      }, { status: 400 });
    }

    // Buscar parte
    const partes = await base44.asServiceRole.entities.ProcessoParte.filter({ id: parte_id });
    if (!partes.length) {
      return Response.json({ error: 'Parte não encontrada' }, { status: 404 });
    }
    const parte = partes[0];

    // Buscar cliente
    const clientes = await base44.asServiceRole.entities.Cliente.filter({ id: cliente_id });
    if (!clientes.length) {
      return Response.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }
    const cliente = clientes[0];

    // Sincronizar dados da parte para o cliente
    const dadosAtualizados = {};

    // CPF/CNPJ
    if (parte.cpf_cnpj && !cliente.cpf_cnpj) {
      dadosAtualizados.cpf_cnpj = parte.cpf_cnpj;
      if (parte.tipo_pessoa === 'juridica') {
        dadosAtualizados.cnpj = parte.cpf_cnpj;
      } else {
        dadosAtualizados.cpf = parte.cpf_cnpj;
      }
    }

    // Advogados (extrair emails e telefones)
    if (parte.advogados?.length > 0) {
      const emailsExistentes = [
        cliente.email,
        ...(cliente.emails_adicionais?.map(e => e.email) || [])
      ].filter(Boolean);
      
      const telefonesExistentes = [
        cliente.telefone,
        ...(cliente.telefones_adicionais?.map(t => t.telefone) || [])
      ].filter(Boolean);

      const emailsNovos = [];
      const telefonesNovos = [];

      parte.advogados.forEach(adv => {
        if (adv.email && !emailsExistentes.includes(adv.email)) {
          emailsNovos.push({
            email: adv.email,
            tipo: 'trabalho',
            principal: false
          });
          emailsExistentes.push(adv.email);
        }

        if (adv.telefone && !telefonesExistentes.includes(adv.telefone)) {
          telefonesNovos.push({
            telefone: adv.telefone,
            tipo: 'celular',
            whatsapp: true,
            principal: false
          });
          telefonesExistentes.push(adv.telefone);
        }
      });

      if (emailsNovos.length > 0) {
        dadosAtualizados.emails_adicionais = [
          ...(cliente.emails_adicionais || []),
          ...emailsNovos
        ];
      }

      if (telefonesNovos.length > 0) {
        dadosAtualizados.telefones_adicionais = [
          ...(cliente.telefones_adicionais || []),
          ...telefonesNovos
        ];
      }
    }

    // Atualizar cliente se houver dados novos
    if (Object.keys(dadosAtualizados).length > 0) {
      await base44.asServiceRole.entities.Cliente.update(cliente_id, dadosAtualizados);
    }

    // Buscar TODAS as partes com mesmo nome/documento e sincronizar
    const criterios = [];
    
    if (parte.nome) {
      criterios.push({ nome: parte.nome, escritorio_id: parte.escritorio_id });
    }
    
    if (parte.cpf_cnpj) {
      criterios.push({ cpf_cnpj: parte.cpf_cnpj, escritorio_id: parte.escritorio_id });
    }

    const todasPartesRelacionadas = [];
    for (const criterio of criterios) {
      const partesEncontradas = await base44.asServiceRole.entities.ProcessoParte.filter(criterio);
      partesEncontradas.forEach(p => {
        if (!todasPartesRelacionadas.find(tp => tp.id === p.id)) {
          todasPartesRelacionadas.push(p);
        }
      });
    }

    // Atualizar TODAS as partes relacionadas
    let partesAtualizadas = 0;
    for (const parteRelacionada of todasPartesRelacionadas) {
      if (parteRelacionada.cliente_id !== cliente_id || !parteRelacionada.e_cliente_escritorio) {
        await base44.asServiceRole.entities.ProcessoParte.update(parteRelacionada.id, {
          e_cliente_escritorio: true,
          cliente_id: cliente_id,
          cpf_cnpj: parte.cpf_cnpj || parteRelacionada.cpf_cnpj
        });
        partesAtualizadas++;
      }
    }

    return Response.json({
      success: true,
      cliente_id,
      dados_sincronizados: Object.keys(dadosAtualizados),
      partes_sincronizadas: partesAtualizadas
    });

  } catch (error) {
    console.error('Erro sincronizarParteComCliente:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});