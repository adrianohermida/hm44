import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, phone, message, appointmentType, selectedDate, selectedSlot } = await req.json();

    // Obter user e escritorio
    const user = await base44.auth.me();
    
    let escritorio = null;
    try {
      const escritorios = await base44.asServiceRole.entities.Escritorio.list();
      escritorio = escritorios?.[0];
    } catch (e) {
      console.error('Erro ao buscar escritório:', e);
    }

    // Se não encontrar escritório, usar um padrão (desenvolvimento)
    if (!escritorio?.id) {
      // Criar objeto fake para desenvolvimento/testes
      escritorio = { id: 'default-escritorio' };
    }

    // Criar registro de agendamento (Appointment entity)
    const appointment = await base44.asServiceRole.entities.Appointment.create({
      cliente_nome: name,
      cliente_email: email,
      cliente_telefone: phone,
      tipo_agendamento: appointmentType === 'tecnica' ? 'consultoria' : 'avaliacao_inicial',
      descricao: message || '',
      data: selectedDate,
      hora: selectedSlot,
      status: 'pendente_confirmacao',
      escritorio_id: escritorio.id,
      doctor_email: 'adriano@example.com'
    });

    // Enviar email de confirmação
    try {
      const emailBody = `
        <h2>Solicitação de Agendamento Recebida!</h2>
        <p>Olá <strong>${name}</strong>,</p>
        <p>Recebemos sua solicitação de agendamento. Aqui estão os detalhes:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Data:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(selectedDate).toLocaleDateString('pt-BR')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Horário:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${selectedSlot}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tipo:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${appointmentType === 'tecnica' ? 'Consulta Técnica' : 'Avaliação Inicial'}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">Nossa equipe entrará em contato em breve para confirmar o horário.</p>
        <hr style="margin: 20px 0;">
        <p><strong>Hermida Maia Advocacia</strong><br>
        📞 WhatsApp: <a href="tel:+5151996032004">(51) 99603-2004</a><br>
        🌐 <a href="https://hermidomaia.com.br">https://hermidomaia.com.br</a></p>
      `;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: 'Agendamento Recebido - Hermida Maia Advocacia',
        body: emailBody
      });
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não falha a operação se email não enviar
    }

    return Response.json({ 
      success: true, 
      appointmentId: appointment.id 
    });
  } catch (error) {
    console.error('Erro ao processar agendamento:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});