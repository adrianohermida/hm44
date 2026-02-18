export function mapearProcessoCompleto(processoRaw) {
  const fontePrincipal = processoRaw.fontes?.find(f => f.tipo === 'TRIBUNAL') || 
                          processoRaw.fontes?.[0];
  
  const todasMovimentacoes = [];
  const todasAudiencias = [];
  
  processoRaw.fontes?.forEach(fonte => {
    fonte.movimentacoes?.forEach(mov => todasMovimentacoes.push({...mov, fonte: fonte.sigla}));
    fonte.audiencias?.forEach(aud => todasAudiencias.push({...aud, fonte: fonte.sigla}));
  });

  return {
    numero_cnj: processoRaw.numero_cnj,
    titulo: processoRaw.titulo_polo_ativo && processoRaw.titulo_polo_passivo
      ? `${processoRaw.titulo_polo_ativo} x ${processoRaw.titulo_polo_passivo}`
      : processoRaw.numero_cnj,
    tribunal: processoRaw.unidade_origem?.tribunal_sigla,
    sistema: fontePrincipal?.sistema,
    status: fontePrincipal?.status_predito?.toLowerCase() || 'ativo',
    instancia: fontePrincipal?.grau_formatado,
    classe: fontePrincipal?.capa?.classe,
    assunto: fontePrincipal?.capa?.assunto,
    area: fontePrincipal?.capa?.area,
    orgao_julgador: fontePrincipal?.capa?.orgao_julgador,
    data_distribuicao: fontePrincipal?.capa?.data_distribuicao || processoRaw.data_inicio,
    valor_causa: fontePrincipal?.capa?.valor_causa?.valor_formatado,
    polo_ativo: processoRaw.titulo_polo_ativo,
    polo_passivo: processoRaw.titulo_polo_passivo,
    apensos_raw: processoRaw.processos_relacionados?.map(p => p.numero).join(', '),
    movimentacoes: todasMovimentacoes,
    audiencias: todasAudiencias,
    dados_completos_api: processoRaw,
    fonte_origem: 'OAB'
  };
}