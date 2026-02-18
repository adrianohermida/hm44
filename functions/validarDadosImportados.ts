import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { escritorio_id } = await req.json();

    const validacoes = {};

    // Validar Processos
    const processos = await base44.entities.Processo.filter({ escritorio_id });
    const errosProcessos = [];
    
    for (const proc of processos) {
      if (!proc.numero_cnj || proc.numero_cnj.length !== 20) {
        errosProcessos.push({
          tipo: 'CNJ Inválido',
          mensagem: `CNJ "${proc.numero_cnj}" não tem 20 dígitos`,
          registro_id: proc.id
        });
      }
      if (!proc.tribunal) {
        errosProcessos.push({
          tipo: 'Tribunal Ausente',
          mensagem: 'Processo sem tribunal definido',
          registro_id: proc.id
        });
      }
    }
    
    validacoes.Processos = {
      total: processos.length,
      erros: errosProcessos
    };

    // Validar Prazos
    const prazos = await base44.entities.Prazo.filter({ escritorio_id });
    const errosPrazos = [];
    
    for (const prazo of prazos) {
      if (!prazo.processo_id) {
        errosPrazos.push({
          tipo: 'Processo Não Vinculado',
          mensagem: 'Prazo sem processo associado',
          registro_id: prazo.id
        });
      }
      if (!prazo.data_vencimento) {
        errosPrazos.push({
          tipo: 'Data Vencimento Ausente',
          mensagem: 'Prazo sem data de vencimento',
          registro_id: prazo.id
        });
      }
    }
    
    validacoes.Prazos = {
      total: prazos.length,
      erros: errosPrazos
    };

    // Validar Clientes
    const clientes = await base44.entities.Cliente.filter({ escritorio_id });
    const errosClientes = [];
    
    for (const cliente of clientes) {
      if (!cliente.email && !cliente.telefone) {
        errosClientes.push({
          tipo: 'Contato Ausente',
          mensagem: 'Cliente sem email nem telefone',
          registro_id: cliente.id
        });
      }
      if (cliente.tipo_pessoa === 'fisica' && !cliente.cpf) {
        errosClientes.push({
          tipo: 'CPF Ausente',
          mensagem: 'Pessoa física sem CPF',
          registro_id: cliente.id
        });
      }
      if (cliente.tipo_pessoa === 'juridica' && !cliente.cnpj) {
        errosClientes.push({
          tipo: 'CNPJ Ausente',
          mensagem: 'Pessoa jurídica sem CNPJ',
          registro_id: cliente.id
        });
      }
    }
    
    validacoes.Clientes = {
      total: clientes.length,
      erros: errosClientes
    };

    const totalErros = Object.values(validacoes).reduce((sum, v) => sum + v.erros.length, 0);

    return Response.json({
      success: true,
      validacoes,
      resumo: {
        total_erros: totalErros,
        entidades_validadas: Object.keys(validacoes).length
      }
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      erro: error.message 
    }, { status: 500 });
  }
});