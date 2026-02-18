import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cliente_ids } = await req.json();

    if (!cliente_ids || !Array.isArray(cliente_ids) || cliente_ids.length === 0) {
      return Response.json({ 
        error: 'cliente_ids obrigatório (array)' 
      }, { status: 400 });
    }

    const resultados = [];
    let enriquecidos = 0;

    for (const id of cliente_ids) {
      const clientes = await base44.asServiceRole.entities.Cliente.filter({ id });
      if (clientes.length === 0) continue;

      const cliente = clientes[0];

      // Pular se já tem dados enriquecidos recentes
      if (cliente.dados_enriquecidos_api && cliente.updated_date) {
        const diasDesdeAtualizacao = (Date.now() - new Date(cliente.updated_date)) / (1000 * 60 * 60 * 24);
        if (diasDesdeAtualizacao < 30) {
          resultados.push({ id, status: 'já_enriquecido' });
          continue;
        }
      }

      try {
        let resultado = null;

        if (!cliente.cpf_cnpj) {
          resultados.push({ id, status: 'sem_cpf_cnpj' });
          continue;
        }

        if (cliente.tipo_pessoa === 'fisica') {
          const response = await base44.asServiceRole.functions.invoke('consultarCPFDirectData', {
            cpf: cliente.cpf_cnpj
          });
          resultado = response.data;
        } else if (cliente.tipo_pessoa === 'juridica') {
          const response = await base44.asServiceRole.functions.invoke('consultarCNPJDirectData', {
            cnpj: cliente.cpf_cnpj
          });
          resultado = response.data;
        }

        if (resultado && resultado.retorno && !resultado.error) {
          const ret = resultado.retorno;
          const emails = ret.Emails || ret.emails || [];
          const telefones = ret.Telefones || ret.telefones || [];
          const enderecos = ret.Enderecos || ret.enderecos || [];

          const dadosAtualizados = {
            dados_enriquecidos_api: resultado
          };

          // Atualizar apenas campos vazios
          if (!cliente.email && emails[0]) {
            dadosAtualizados.email = emails[0].EnderecoEmail || emails[0].enderecoEmail;
          }

          if (!cliente.telefone && telefones[0]) {
            dadosAtualizados.telefone = telefones[0].TelefoneComDDD || telefones[0].telefoneComDDD;
          }

          if ((!cliente.endereco || !cliente.endereco.cep) && enderecos[0]) {
            dadosAtualizados.endereco = {
              logradouro: enderecos[0].Logradouro || enderecos[0].logradouro || '',
              numero: enderecos[0].Numero || enderecos[0].numero || '',
              complemento: enderecos[0].Complemento || enderecos[0].complemento || '',
              bairro: enderecos[0].Bairro || enderecos[0].bairro || '',
              cidade: enderecos[0].Cidade || enderecos[0].cidade || '',
              estado: enderecos[0].UF || enderecos[0].uf || '',
              cep: enderecos[0].CEP || enderecos[0].cep || ''
            };
          }

          // Adicionar emails/telefones/endereços adicionais
          if (emails.length > 0) {
            dadosAtualizados.emails_adicionais = emails.map(e => ({
              email: e.EnderecoEmail || e.enderecoEmail,
              tipo: cliente.tipo_pessoa === 'fisica' ? 'pessoal' : 'trabalho'
            }));
          }

          if (telefones.length > 0) {
            dadosAtualizados.telefones_adicionais = telefones.map(t => ({
              telefone: t.TelefoneComDDD || t.telefoneComDDD,
              tipo: cliente.tipo_pessoa === 'fisica' ? 'celular' : 'comercial',
              operadora: t.Operadora || t.operadora,
              whatsapp: (t.WhatsApp || t.whatsApp) === 'SIM'
            }));
          }

          if (enderecos.length > 0) {
            dadosAtualizados.enderecos_adicionais = enderecos.map((e, idx) => ({
              tipo: cliente.tipo_pessoa === 'fisica' ? 'residencial' : 'comercial',
              logradouro: e.Logradouro || e.logradouro || '',
              numero: e.Numero || e.numero || '',
              complemento: e.Complemento || e.complemento || '',
              bairro: e.Bairro || e.bairro || '',
              cidade: e.Cidade || e.cidade || '',
              estado: e.UF || e.uf || '',
              cep: e.CEP || e.cep || '',
              preferencial_correspondencia: idx === 0
            }));
          }

          await base44.asServiceRole.entities.Cliente.update(id, dadosAtualizados);
          enriquecidos++;
          resultados.push({ id, status: 'enriquecido' });
        } else {
          resultados.push({ id, status: 'sem_dados' });
        }
      } catch (error) {
        console.error(`Erro enriquecendo cliente ${id}:`, error);
        resultados.push({ id, status: 'erro', mensagem: error.message });
      }
    }

    return Response.json({
      success: true,
      enriquecidos,
      total: cliente_ids.length,
      resultados
    });

  } catch (error) {
    console.error('Erro enriquecerClientes:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});