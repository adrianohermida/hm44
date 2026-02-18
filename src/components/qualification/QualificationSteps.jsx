export const QUALIFICATION_STEPS = [
  { id: 'tipo_divida', type: 'options', question: 'Que tipo de dívida você tem?' },
  { id: 'valor_total', type: 'options', question: 'Qual o valor total aproximado?' },
  { id: 'renda', type: 'options', question: 'Qual sua renda mensal?' },
  { id: 'situacao', type: 'options', question: 'Qual sua situação atual?' },
  { id: 'nome', type: 'input', question: 'Qual seu nome completo?', inputType: 'text' },
  { id: 'email', type: 'input', question: 'Qual seu melhor email?', inputType: 'email' },
  { id: 'telefone', type: 'input', question: 'Qual seu WhatsApp?', inputType: 'tel' },
];

export const STEP_OPTIONS = {
  tipo_divida: [
    { value: 'cartao', label: 'Cartão de Crédito', emoji: '💳' },
    { value: 'emprestimo', label: 'Empréstimo Bancário', emoji: '🏦' },
    { value: 'consignado', label: 'Consignado', emoji: '📋' },
  ],
  valor_total: [
    { value: '10k-', label: 'Até R$ 10 mil', emoji: '💰' },
    { value: '10k-50k', label: 'R$ 10 a 50 mil', emoji: '💵' },
    { value: '50k+', label: 'Acima de R$ 50 mil', emoji: '💸' },
  ],
  renda: [
    { value: '0-3k', label: 'Até R$ 3.000', emoji: '💵' },
    { value: '3k-8k', label: 'R$ 3.000 a 8.000', emoji: '💰' },
    { value: '8k+', label: 'Acima de R$ 8.000', emoji: '💸' },
  ],
  situacao: [
    { value: 'atraso', label: 'Contas em atraso', emoji: '⏰' },
    { value: 'negativado', label: 'Nome negativado', emoji: '❌' },
    { value: 'execucao', label: 'Execução judicial', emoji: '⚖️' },
  ],
};