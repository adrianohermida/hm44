import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nome, cpf_cnpj, escritorio_id, limite = 5000 } = await req.json();

    if (!nome) {
      return Response.json({
        error: 'Nome é obrigatório'
      }, { status: 400 });
    }

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'ESCAVADOR_API_TOKEN não configurado' }, { status: 500 });
    }

    // Buscar quantidade de processos no Escavador
    const baseUrl = 'https://api.escavador.com/api/v2/envolvido/processos';
    const params = new URLSearchParams();
    params.append('nome', nome);
    params.append('quantidade_processos', limite.toString());
    
    if (cpf_cnpj) {
      const doc = cpf_cnpj.replace(/\D/g, '');
      if (doc.length === 11) {
        params.append('cpf', doc);
      } else if (doc.length === 14) {
        params.append('cnpj', doc);
      }
    }

    const url = `${baseUrl}?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      return Response.json({ 
        ja_cadastrados: 0,
        faltam_cadastrar: 0,
        total_escavador: 0
      });
    }

    const data = await response.json();
    const totalEscavador = data.items?.length || 0;

    // Buscar processos já cadastrados
    const processosExistentes = await base44.asServiceRole.entities.Processo.filter({
      escritorio_id
    });
    
    const numerosExistentes = new Set(
      processosExistentes.map(p => p.numero_cnj?.replace(/\D/g, ''))
    );

    // Contar quantos já existem
    let jaCadastrados = 0;
    for (const item of data.items || []) {
      const numeroCNJ = item.numero_cnj?.replace(/\D/g, '');
      if (numeroCNJ && numerosExistentes.has(numeroCNJ)) {
        jaCadastrados++;
      }
    }

    const faltamCadastrar = totalEscavador - jaCadastrados;

    return Response.json({
      ja_cadastrados: jaCadastrados,
      faltam_cadastrar: faltamCadastrar,
      total_escavador: totalEscavador
    });

  } catch (error) {
    console.error('Erro verificarProcessosDisponiveis:', error);
    return Response.json({ 
      error: error.message,
      ja_cadastrados: 0,
      faltam_cadastrar: 0,
      total_escavador: 0
    }, { status: 500 });
  }
});