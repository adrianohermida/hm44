/**
 * Deduplica partes por nome e documento
 */
export function deduplicatePartes(partes) {
  return Object.values(
    partes.reduce((acc, parte) => {
      const key = `${parte.nome}-${parte.cpf_cnpj || 'sem-doc'}`;
      if (!acc[key]) acc[key] = parte;
      return acc;
    }, {})
  );
}

/**
 * Deduplica advogados por nome e OAB
 */
export function deduplicateAdvogados(advogados) {
  return Object.values(
    advogados.reduce((acc, adv) => {
      const key = `${adv.nome}-${adv.oab_numero}-${adv.oab_uf}`;
      if (!acc[key]) acc[key] = adv;
      return acc;
    }, {})
  );
}

/**
 * Filtra clientes por termo de busca
 */
export function filterClientes(clientes, searchTerm) {
  const termo = searchTerm.toLowerCase();
  const cnpjCpf = searchTerm.replace(/\D/g, '');
  
  return clientes.filter(c => 
    c.nome_completo?.toLowerCase().includes(termo) ||
    c.cpf_cnpj?.includes(cnpjCpf)
  );
}

/**
 * Filtra processos por termo de busca
 */
export function filterProcessos(processos, searchTerm) {
  const termo = searchTerm.toLowerCase();
  const numero = searchTerm.replace(/\D/g, '');
  
  return processos.filter(p => 
    p.numero_cnj?.includes(numero) ||
    p.titulo?.toLowerCase().includes(termo)
  );
}

/**
 * Filtra partes por termo de busca
 */
export function filterPartes(partes, searchTerm) {
  const termo = searchTerm.toLowerCase();
  const doc = searchTerm.replace(/\D/g, '');
  
  return partes.filter(p => 
    p.nome?.toLowerCase().includes(termo) ||
    p.cpf_cnpj?.includes(doc)
  );
}

/**
 * Filtra advogados por termo de busca
 */
export function filterAdvogados(advogados, searchTerm) {
  const termo = searchTerm.toLowerCase();
  const numero = searchTerm.replace(/\D/g, '');
  
  return advogados.filter(a => 
    a.nome?.toLowerCase().includes(termo) ||
    a.oab_numero?.toString().includes(numero) ||
    a.cpf?.includes(numero)
  );
}