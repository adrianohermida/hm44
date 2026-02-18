import { base44 } from '@/api/base44Client';

export async function notificarTicketAtribuido(ticketId, responsavelEmail, escritorioId) {
  try {
    await base44.functions.invoke('notificarTicketAtribuido', {
      ticket_id: ticketId,
      responsavel_email: responsavelEmail,
      escritorio_id: escritorioId
    });
  } catch (error) {
    console.error('Erro ao notificar atribuição:', error);
  }
}

export async function notificarTicketAtualizado(ticketId, escritorioId, autorAtualizacao) {
  try {
    await base44.functions.invoke('notificarTicketAtualizado', {
      ticket_id: ticketId,
      escritorio_id: escritorioId,
      autor_atualizacao: autorAtualizacao
    });
  } catch (error) {
    console.error('Erro ao notificar atualização:', error);
  }
}