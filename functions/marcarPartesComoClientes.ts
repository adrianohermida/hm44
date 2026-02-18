import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { parte_ids, advogado_id, criar_cliente = true } = await req.json();

    if (!parte_ids || !Array.isArray(parte_ids) || parte_ids.length === 0) {
      return Response.json({ 
        error: 'parte_ids obrigatório (array)' 
      }, { status: 400 });
    }

    let advogadoData = null;
    if (advogado_id) {
      const users = await base44.asServiceRole.entities.User.filter({ id: advogado_id });
      if (users.length > 0) {
        const advogado = users[0];
        advogadoData = {
          nome: advogado.full_name,
          email: advogado.email
        };
        
        // Buscar InscricaoOAB do advogado
        const inscricoes = await base44.asServiceRole.entities.InscricaoOAB.filter({
          user_email: advogado.email
        });
        
        if (inscricoes.length > 0) {
          advogadoData.oabs = inscricoes.map(i => ({
            numero: i.numero,
            uf: i.uf,
            tipo: i.tipo || 'principal'
          }));
        }
      }
    }

    const resultados = [];
    const partesProcessadas = new Set();

    for (const parte_id of parte_ids) {
      // Prevenir duplicação
      if (partesProcessadas.has(parte_id)) {
        console.warn(`Parte ${parte_id} já processada, pulando...`);
        continue;
      }
      partesProcessadas.add(parte_id);

      const partes = await base44.asServiceRole.entities.ProcessoParte.filter({ 
        id: parte_id 
      });
      
      if (!partes.length) continue;
      
      const parte = partes[0];
      
      // Verificar se já é cliente
      if (parte.e_cliente_escritorio && parte.cliente_id) {
        resultados.push({
          parte_id,
          erro: 'Parte já é cliente',
          cliente_id: parte.cliente_id
        });
        continue;
      }

      const processos = await base44.asServiceRole.entities.Processo.filter({ 
        id: parte.processo_id 
      });
      
      if (!processos.length) continue;
      
      const escritorio_id = processos[0].escritorio_id;
      let cliente_id = parte.cliente_id;
      let criado = false;

      if (criar_cliente && !cliente_id) {
        // Buscar cliente existente por CPF/CNPJ ou OAB
        const todosClientes = await base44.asServiceRole.entities.Cliente.filter({
          escritorio_id
        });

        // Buscar por CPF/CNPJ
        if (parte.cpf_cnpj) {
          const porDocumento = todosClientes.find(c => 
            c.cpf_cnpj === parte.cpf_cnpj ||
            c.cpf === parte.cpf_cnpj ||
            c.cnpj === parte.cpf_cnpj
          );
          if (porDocumento) {
            cliente_id = porDocumento.id;
            console.log(`Cliente existente encontrado por documento: ${porDocumento.nome_completo} (${parte.cpf_cnpj})`);
          }
        }

        // Buscar por OAB se não encontrou e parte tem advogados
        if (!cliente_id && parte.advogados?.length > 0) {
          const primeiroAdv = parte.advogados[0];
          if (primeiroAdv.oabs?.length > 0) {
            const oabBusca = primeiroAdv.oabs[0];
            
            // Buscar todos os Users
            const allUsers = await base44.asServiceRole.entities.User.list();
            const userComOAB = allUsers.find(u => 
              u.inscricoes_oab?.some(oab => 
                oab.numero === oabBusca.numero && oab.uf === oabBusca.uf
              )
            );

            if (userComOAB) {
              // Buscar cliente pelo email do user
              const clientePorEmail = todosClientes.find(c => c.email === userComOAB.email);
              if (clientePorEmail) {
                cliente_id = clientePorEmail.id;
                console.log(`Cliente existente encontrado por OAB: ${clientePorEmail.nome_completo} (${oabBusca.numero}/${oabBusca.uf})`);
              }
            }
          }
        }

        // Se não encontrou, criar novo cliente
        if (!cliente_id) {
          // Criar novo cliente com CPF/CNPJ obrigatório
          const telefones = parte.advogados?.[0]?.telefone 
            ? [{ numero: parte.advogados[0].telefone, tipo: 'celular' }]
            : [];

          const clienteData = {
            escritorio_id,
            nome_completo: parte.nome,
            tipo_pessoa: parte.tipo_pessoa || 'fisica',
            telefones,
            origem: 'processo_manual',
            status: 'ativo'
          };

          // Adicionar CPF/CNPJ se disponível
          if (parte.cpf_cnpj) {
            clienteData.cpf_cnpj = parte.cpf_cnpj;
            // Mapear para campo correto conforme tipo_pessoa
            if (parte.tipo_pessoa === 'juridica') {
              clienteData.cnpj = parte.cpf_cnpj;
            } else {
              clienteData.cpf = parte.cpf_cnpj;
            }
          }

          const novoCliente = await base44.asServiceRole.entities.Cliente.create(clienteData);
          cliente_id = novoCliente.id;
          criado = true;
          console.log(`Novo cliente criado: ${parte.nome} (${parte.cpf_cnpj})`);
        }
      }

      // Associar processo ao cliente se ainda não estiver
      if (cliente_id) {
        const clienteAtual = await base44.asServiceRole.entities.Cliente.filter({ id: cliente_id });
        if (clienteAtual.length > 0) {
          const processosAssociados = clienteAtual[0].processos_ids || [];
          if (!processosAssociados.includes(parte.processo_id)) {
            await base44.asServiceRole.entities.Cliente.update(cliente_id, {
              processos_ids: [...processosAssociados, parte.processo_id]
            });
          }
        }
      }

      // Atualizar parte com cliente e advogado
      const updateData = {
        e_cliente_escritorio: true,
        cliente_id
      };

      // Preservar CPF/CNPJ se já existe
      if (parte.cpf_cnpj) {
        updateData.cpf_cnpj = parte.cpf_cnpj;
      }

      // Adicionar advogado apenas uma vez, evitando duplicatas
      if (advogadoData) {
        const advogadosAtuais = parte.advogados || [];
        const jaExiste = advogadosAtuais.some(adv => 
          adv.email === advogadoData.email || 
          (adv.oabs?.[0] && advogadoData.oabs?.[0] && 
           adv.oabs[0].numero === advogadoData.oabs[0].numero &&
           adv.oabs[0].uf === advogadoData.oabs[0].uf)
        );
        
        if (!jaExiste) {
          updateData.advogados = [...advogadosAtuais, advogadoData];
        }
      }

      await base44.asServiceRole.entities.ProcessoParte.update(parte_id, updateData);

      // Sincronizar TODAS as partes com mesmo nome/documento
      if (parte.nome || parte.cpf_cnpj) {
        const criterios = [];
        if (parte.nome) criterios.push({ nome: parte.nome, escritorio_id });
        if (parte.cpf_cnpj) criterios.push({ cpf_cnpj: parte.cpf_cnpj, escritorio_id });

        const todasPartes = [];
        for (const criterio of criterios) {
          const encontradas = await base44.asServiceRole.entities.ProcessoParte.filter(criterio);
          encontradas.forEach(p => {
            if (!todasPartes.find(tp => tp.id === p.id)) {
              todasPartes.push(p);
            }
          });
        }

        // Atualizar todas
        for (const p of todasPartes) {
          if (p.id !== parte_id && (p.cliente_id !== cliente_id || !p.e_cliente_escritorio)) {
            await base44.asServiceRole.entities.ProcessoParte.update(p.id, {
              e_cliente_escritorio: true,
              cliente_id,
              cpf_cnpj: parte.cpf_cnpj || p.cpf_cnpj
            });
          }
        }
      }

      resultados.push({
        parte_id,
        cliente_id,
        criado,
        nome: parte.nome
      });
    }

    return Response.json({
      success: true,
      resultados,
      total: resultados.length,
      clientes_criados: resultados.filter(r => r.criado).length
    });

  } catch (error) {
    console.error('Erro marcarPartesComoClientes:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});