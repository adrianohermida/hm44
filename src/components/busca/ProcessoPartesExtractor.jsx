// Consolida envolvidos de TODAS as fontes do processo
function consolidarEnvolvidos(processoData) {
  const envolvidosMap = new Map();
  
  processoData.fontes?.forEach(fonte => {
    fonte.envolvidos?.forEach(env => {
      const key = env.cpf || env.cnpj || env.nome;
      if (!envolvidosMap.has(key)) {
        envolvidosMap.set(key, env);
      } else {
        const existing = envolvidosMap.get(key);
        // Mesclar advogados
        const advogadosExistentes = existing.advogados || [];
        const novosAdvogados = env.advogados || [];
        existing.advogados = [...advogadosExistentes, ...novosAdvogados]
          .filter((adv, idx, arr) => 
            arr.findIndex(a => a.cpf === adv.cpf && a.nome === adv.nome) === idx
          );
      }
    });
  });
  
  return Array.from(envolvidosMap.values());
}

// Extrai partes do processo identificando o cliente pela OAB
export function extrairPartes(processoData, oabBuscada) {
  const envolvidos = consolidarEnvolvidos(processoData);
  const partes = [];

  envolvidos.forEach(env => {
    if (env.polo === 'ADVOGADO') return;

    const parte = {
      tipo_parte: env.polo === 'ATIVO' ? 'polo_ativo' : 
                  env.polo === 'PASSIVO' ? 'polo_passivo' : 'terceiro_interessado',
      tipo_pessoa: env.tipo_pessoa?.toLowerCase() || 'fisica',
      nome: env.nome,
      cpf_cnpj: env.cpf || env.cnpj,
      qualificacao: env.tipo_normalizado || env.tipo,
      advogados: [],
      e_cliente_escritorio: false,
      dados_completos_api: env
    };

    env.advogados?.forEach(adv => {
      const advInfo = {
        nome: adv.nome,
        oab_numero: adv.oabs?.[0]?.numero?.toString(),
        oab_uf: adv.oabs?.[0]?.uf,
        cpf: adv.cpf
      };
      parte.advogados.push(advInfo);

      adv.oabs?.forEach(oab => {
        if (oab.numero?.toString() === oabBuscada.numero && 
            oab.uf === oabBuscada.estado) {
          parte.e_cliente_escritorio = true;
        }
      });
    });

    partes.push(parte);
  });

  return partes;
}

export function identificarClienteAutomatico(partes) {
  return partes.find(p => p.e_cliente_escritorio) || null;
}