import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numero_cnj, salvar = false, processo_id } = await req.json();
    
    if (!numero_cnj) {
      return Response.json({ error: 'numero_cnj obrigatório' }, { status: 400 });
    }

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'Token não configurado' }, { status: 500 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    const url = `https://api.escavador.com/api/v2/processos/numero_cnj/${numero_cnj}/envolvidos`;

    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const tempo_resposta_ms = Date.now() - startTime;

    // Registrar consumo (1 crédito)
    if (escritorioId) {
      await base44.asServiceRole.entities.ConsumoAPIExterna.create({
        escritorio_id: escritorioId,
        usuario_email: user.email,
        provedor_id: '6949735a71244b18c7a49e5e',
        endpoint_id: '6952a7c125200f761ab2d95a',
        operacao: 'producao',
        parametros: { numero_cnj },
        sucesso: response.ok,
        http_status: response.status,
        creditos_consumidos: response.ok ? 1 : 0,
        tempo_resposta_ms
      });
    }

    if (!response.ok) {
      const error = await response.json();
      return Response.json({ error }, { status: response.status });
    }

    const data = await response.json();

    // Salvar partes no banco se solicitado
    if (salvar && processo_id && escritorioId && data.items) {
      const partesSalvas = [];

      for (const envolvido of data.items) {
        // Para cada participação no processo
        for (const participacao of envolvido.participacoes_processo || []) {
          // Mapear polo Escavador para tipo_parte
          let tipo_parte = 'terceiro_interessado';
          if (participacao.polo === 'ATIVO') tipo_parte = 'polo_ativo';
          else if (participacao.polo === 'PASSIVO') tipo_parte = 'polo_passivo';

          // Criar parte principal
          const parteData = {
            escritorio_id: escritorioId,
            processo_id,
            nome: envolvido.nome,
            cpf_cnpj: envolvido.cpf || envolvido.cnpj,
            tipo_pessoa: envolvido.tipo_pessoa?.toLowerCase() || 'fisica',
            tipo_parte,
            qualificacao: participacao.tipo_normalizado || participacao.tipo,
            polo_escavador: participacao.polo || 'DESCONHECIDO',
            advogados: participacao.advogados || [],
            dados_completos_api: envolvido
          };

          // 1. Buscar cliente existente pelo CPF/CNPJ
          let clienteId = null;
          if (parteData.cpf_cnpj) {
            const clientes = await base44.asServiceRole.entities.Cliente.filter({
              escritorio_id: escritorioId,
              cpf_cnpj: parteData.cpf_cnpj
            });
            if (clientes.length > 0) {
              clienteId = clientes[0].id;
              parteData.cliente_id = clienteId;
              parteData.e_cliente_escritorio = true;
            }
          }

          // 2. Buscar parte existente - SOMENTE por nome e cpf_cnpj (NÃO por tipo_parte)
          const existingPartes = await base44.asServiceRole.entities.ProcessoParte.filter({
            processo_id,
            nome: parteData.nome
          });

          // Encontrar match exato por CPF/CNPJ (se tiver)
          const exactMatch = existingPartes.find(p => {
            if (parteData.cpf_cnpj && p.cpf_cnpj) {
              return p.cpf_cnpj === parteData.cpf_cnpj;
            }
            // Se não tem documento, match só por nome (menos confiável)
            return !parteData.cpf_cnpj && !p.cpf_cnpj;
          });

          if (!exactMatch) {
            // Não existe - criar nova parte
            const novaParte = await base44.asServiceRole.entities.ProcessoParte.create(parteData);
            partesSalvas.push(novaParte);
          } else {
            // Já existe - atualizar dados se necessário
            const updates = {};
            
            // Atualizar cliente_id se encontrado
            if (clienteId && (!exactMatch.e_cliente_escritorio || exactMatch.cliente_id !== clienteId)) {
              updates.cliente_id = clienteId;
              updates.e_cliente_escritorio = true;
            }
            
            // Se tipo_parte mudou, é um débito técnico - registrar mas não duplicar
            if (exactMatch.tipo_parte !== parteData.tipo_parte) {
              console.log(`[DÉBITO TÉCNICO] Parte ${parteData.nome} tem tipo_parte diferente: ${exactMatch.tipo_parte} → ${parteData.tipo_parte}`);
              // Não sobrescrever, manter o original
            }
            
            // Atualizar advogados se vieram novos
            if (parteData.advogados?.length > 0) {
              updates.advogados = parteData.advogados;
            }
            
            if (Object.keys(updates).length > 0) {
              await base44.asServiceRole.entities.ProcessoParte.update(exactMatch.id, updates);
            }
          }
        }
      }

      return Response.json({
        success: true,
        envolvidos: data.items,
        partes_salvas: partesSalvas.length,
        total_envolvidos: data.items.length
      });
    }

    return Response.json({
      success: true,
      envolvidos: data.items,
      total: data.items.length,
      paginator: data.paginator
    });

  } catch (error) {
    console.error('[listarEnvolvidosProcesso] Erro:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});