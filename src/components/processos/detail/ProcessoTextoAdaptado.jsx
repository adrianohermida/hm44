export const TEXTOS_MODO = {
  admin: {
    overview: 'Visão Geral',
    history: 'Histórico',
    documents: 'Documentos',
    financial: 'Financeiro',
    actions: 'Ações Administrativas',
    monitoring: 'Monitoramento'
  },
  cliente: {
    overview: 'Meu Processo',
    history: 'Andamento',
    documents: 'Meus Documentos',
    financial: 'Valores',
    actions: 'O que Fazer',
    monitoring: 'Acompanhamento'
  }
};

export function getTexto(modo, chave) {
  return TEXTOS_MODO[modo]?.[chave] || TEXTOS_MODO.admin[chave];
}