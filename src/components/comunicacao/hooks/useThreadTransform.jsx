export function transformToThreads(conversas = [], tickets = []) {
  return [
    ...conversas.map(c => ({
      id: c.id,
      tipo: 'conversa',
      canal: c.canal,
      clienteNome: c.cliente_nome,
      clienteEmail: c.cliente_email,
      clienteTelefone: c.cliente_telefone,
      ultimaMensagem: c.ultima_mensagem,
      ultimaAtualizacao: c.ultima_atualizacao,
      status: c.status,
      isVisitante: c.tipo === 'visitante',
      naoLida: c.status === 'aberta',
      prioridade: c.tipo === 'visitante' ? 'media' : 'baixa',
      raw: c
    })),
    ...tickets.map(t => ({
      id: t.id,
      tipo: 'ticket',
      canal: t.canal || 'email',
      clienteNome: t.cliente_nome,
      clienteEmail: t.cliente_email,
      ultimaMensagem: t.descricao,
      ultimaAtualizacao: t.ultima_atualizacao || t.created_date,
      status: t.status,
      isVisitante: false,
      naoLida: t.status === 'aberto',
      prioridade: t.prioridade,
      raw: t
    }))
  ].sort((a, b) => new Date(b.ultimaAtualizacao) - new Date(a.ultimaAtualizacao));
}