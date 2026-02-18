export function limparCNJ(cnj) {
  if (!cnj) return null;
  const limpo = cnj.toString().replace(/[^\d]/g, '');
  return limpo.length === 20 ? limpo : null;
}

export function normalizarTribunal(tribunal) {
  if (!tribunal) return null;
  
  const mapaTribunais = {
    'TJSP': ['tjsp', 'tj-sp', 'tj sp', 'tribunal de justiça de são paulo', 'tribunal de justica de sao paulo'],
    'TJRJ': ['tjrj', 'tj-rj', 'tj rj', 'tribunal de justiça do rio de janeiro'],
    'TJMG': ['tjmg', 'tj-mg', 'tj mg', 'tribunal de justiça de minas gerais'],
    'STJ': ['stj', 'superior tribunal de justiça'],
    'TST': ['tst', 'tribunal superior do trabalho']
  };

  const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const tribunalNorm = normalizar(tribunal);
  
  for (const [sigla, variantes] of Object.entries(mapaTribunais)) {
    if (variantes.some(v => tribunalNorm.includes(v))) return sigla;
  }

  return tribunal.substring(0, 10);
}