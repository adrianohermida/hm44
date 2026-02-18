import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cliente_ids, cliente_principal_id } = await req.json();

    if (!cliente_ids || !Array.isArray(cliente_ids) || cliente_ids.length < 2) {
      return Response.json({ 
        error: 'Mínimo de 2 clientes para mesclar' 
      }, { status: 400 });
    }

    if (!cliente_principal_id) {
      return Response.json({ 
        error: 'cliente_principal_id obrigatório' 
      }, { status: 400 });
    }

    // Buscar todos os clientes
    const clientes = await Promise.all(
      cliente_ids.map(id => base44.asServiceRole.entities.Cliente.filter({ id }))
    );

    const clientesValidos = clientes.filter(c => c.length > 0).map(c => c[0]);

    if (clientesValidos.length < 2) {
      return Response.json({ error: 'Clientes não encontrados' }, { status: 404 });
    }

    // Usar cliente principal selecionado
    const clientePrincipal = clientesValidos.find(c => c.id === cliente_principal_id);

    if (!clientePrincipal) {
      return Response.json({ error: 'Cliente principal não encontrado' }, { status: 404 });
    }

    // Mesclar dados
    const dadosMesclados = { ...clientePrincipal };

    // Arrays para mesclar
    const emailsSet = new Set(clientePrincipal.emails_adicionais?.map(e => e.email) || []);
    const telefonesSet = new Set(clientePrincipal.telefones_adicionais?.map(t => t.telefone) || []);
    const enderecosSet = new Set(clientePrincipal.enderecos_adicionais?.map(e => e.cep) || []);

    clientesValidos.forEach(cliente => {
      if (cliente.id === clientePrincipal.id) return;

      // Emails
      cliente.emails_adicionais?.forEach(e => {
        if (!emailsSet.has(e.email)) {
          emailsSet.add(e.email);
          dadosMesclados.emails_adicionais = [
            ...(dadosMesclados.emails_adicionais || []),
            e
          ];
        }
      });

      // Telefones
      cliente.telefones_adicionais?.forEach(t => {
        if (!telefonesSet.has(t.telefone)) {
          telefonesSet.add(t.telefone);
          dadosMesclados.telefones_adicionais = [
            ...(dadosMesclados.telefones_adicionais || []),
            t
          ];
        }
      });

      // Endereços
      cliente.enderecos_adicionais?.forEach(e => {
        if (!enderecosSet.has(e.cep)) {
          enderecosSet.add(e.cep);
          dadosMesclados.enderecos_adicionais = [
            ...(dadosMesclados.enderecos_adicionais || []),
            e
          ];
        }
      });

      // Dados faltantes - priorizar dados completos
      if (!dadosMesclados.cpf_cnpj && cliente.cpf_cnpj) {
        dadosMesclados.cpf_cnpj = cliente.cpf_cnpj;
        // Mapear para campo específico conforme tipo_pessoa
        if (cliente.tipo_pessoa === 'juridica') {
          dadosMesclados.cnpj = cliente.cpf_cnpj;
        } else {
          dadosMesclados.cpf = cliente.cpf_cnpj;
        }
      }
      if (!dadosMesclados.email && cliente.email) {
        dadosMesclados.email = cliente.email;
      }
      if (!dadosMesclados.telefone && cliente.telefone) {
        dadosMesclados.telefone = cliente.telefone;
      }
    });

    // Atualizar cliente principal
    await base44.asServiceRole.entities.Cliente.update(clientePrincipal.id, dadosMesclados);

    // Atualizar referências em todas as entidades
    const idsSecundarios = clientesValidos
      .filter(c => c.id !== clientePrincipal.id)
      .map(c => c.id);

    const entidadesComCliente = [
      'ProcessoParte',
      'Processo',
      'Honorario',
      'Atendimento',
      'Documento',
      'Tarefa'
    ];

    for (const idSecundario of idsSecundarios) {
      for (const entidade of entidadesComCliente) {
        try {
          const registros = await base44.asServiceRole.entities[entidade].filter({
            cliente_id: idSecundario
          });

          for (const registro of registros) {
            await base44.asServiceRole.entities[entidade].update(registro.id, {
              cliente_id: clientePrincipal.id
            });
          }
        } catch (err) {
          console.warn(`Entidade ${entidade} não encontrada ou erro:`, err.message);
        }
      }
    }

    // Excluir clientes secundários
    for (const idSecundario of idsSecundarios) {
      await base44.asServiceRole.entities.Cliente.delete(idSecundario);
    }

    return Response.json({
      success: true,
      cliente_principal_id: clientePrincipal.id,
      clientes_mesclados: clientesValidos.length
    });

  } catch (error) {
    console.error('Erro mesclarClientes:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});