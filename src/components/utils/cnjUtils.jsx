/**
 * Limpa o número CNJ removendo pontuação, letras e símbolos
 * @param {string} cnj - Número CNJ com ou sem formatação
 * @returns {string} - Número CNJ limpo (20 dígitos)
 */
export function limparCNJ(cnj) {
  if (!cnj) return '';
  return cnj.replace(/\D/g, '').slice(0, 20);
}

/**
 * Formata o número CNJ no padrão NNNNNNN-DD.AAAA.J.TR.OOOO
 * @param {string} cnj - Número CNJ sem formatação (20 dígitos)
 * @returns {string} - Número CNJ formatado
 */
export function formatarCNJ(cnj) {
  if (!cnj) return '';
  
  const limpo = limparCNJ(cnj);
  if (limpo.length !== 20) return cnj;
  
  // NNNNNNN-DD.AAAA.J.TR.OOOO
  return `${limpo.slice(0, 7)}-${limpo.slice(7, 9)}.${limpo.slice(9, 13)}.${limpo.slice(13, 14)}.${limpo.slice(14, 16)}.${limpo.slice(16, 20)}`;
}

/**
 * Valida se um número CNJ é válido (20 dígitos)
 * @param {string} cnj - Número CNJ
 * @returns {boolean}
 */
export function validarCNJ(cnj) {
  const limpo = limparCNJ(cnj);
  return limpo.length === 20;
}

/**
 * Encontra processos duplicados pelo número CNJ
 * @param {Array} processos - Lista de processos
 * @returns {Object} - Mapa de CNJ para array de IDs duplicados
 */
export function encontrarDuplicados(processos) {
  const mapa = {};
  
  processos.forEach(p => {
    const cnj = limparCNJ(p.numero_cnj);
    if (!mapa[cnj]) mapa[cnj] = [];
    mapa[cnj].push(p.id);
  });
  
  return Object.fromEntries(
    Object.entries(mapa).filter(([_, ids]) => ids.length > 1)
  );
}