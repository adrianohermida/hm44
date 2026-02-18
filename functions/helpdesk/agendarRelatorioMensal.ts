import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@2.5.1';
import sgMail from 'npm:@sendgrid/mail@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Service role para executar scheduled task
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorio = escritorios[0];
    
    if (!escritorio) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }

    // Período: mês anterior
    const hoje = new Date();
    const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fimMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0, 23, 59, 59);

    // Query tickets do mês anterior
    const tickets = await base44.asServiceRole.entities.Ticket.filter({
      escritorio_id: escritorio.id,
      created_date: { 
        $gte: inicioMesAnterior.toISOString(), 
        $lte: fimMesAnterior.toISOString() 
      }
    });

    // Gerar PDF
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Relatório Mensal de Atendimento', 20, 20);
    doc.setFontSize(10);
    doc.text(`${escritorio.nome}`, 20, 30);
    doc.text(`Período: ${inicioMesAnterior.toLocaleDateString('pt-BR')} - ${fimMesAnterior.toLocaleDateString('pt-BR')}`, 20, 35);
    doc.text(`Total de tickets: ${tickets.length}`, 20, 40);

    // KPIs
    doc.setFontSize(12);
    doc.text('Resumo:', 20, 50);
    doc.setFontSize(10);
    doc.text(`Abertos: ${tickets.filter(t => t.status === 'aberto').length}`, 20, 58);
    doc.text(`Em Atendimento: ${tickets.filter(t => t.status === 'em_atendimento').length}`, 20, 64);
    doc.text(`Resolvidos: ${tickets.filter(t => t.status === 'resolvido').length}`, 20, 70);
    doc.text(`Alta Prioridade: ${tickets.filter(t => t.prioridade === 'alta').length}`, 20, 76);

    // Tabela
    doc.setFontSize(10);
    doc.text('Nº', 20, 90);
    doc.text('Título', 40, 90);
    doc.text('Status', 120, 90);
    doc.text('Prioridade', 160, 90);

    let y = 100;
    tickets.slice(0, 30).forEach((ticket) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(ticket.numero_ticket || '-', 20, y);
      doc.text(ticket.titulo.substring(0, 25), 40, y);
      doc.text(ticket.status, 120, y);
      doc.text(ticket.prioridade, 160, y);
      y += 8;
    });

    const pdfBase64 = doc.output('dataurlstring').split(',')[1];

    // Buscar admins + emails adicionais da config
    const users = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    const adminEmails = users.map(u => u.email);

    // Buscar configuração de emails adicionais (se existir)
    let emailsAdicionais = [];
    try {
      const configs = await base44.asServiceRole.entities.ConfiguracaoAgenda.filter({ 
        escritorio_id: escritorio.id 
      });
      if (configs[0]?.emails_relatorio_mensal) {
        emailsAdicionais = configs[0].emails_relatorio_mensal;
      }
    } catch (e) {
      // Config não existe ainda
    }

    const destinatarios = [...new Set([...adminEmails, ...emailsAdicionais])];

    // Enviar email via SendGrid
    sgMail.setApiKey(Deno.env.get('SENDGRID_API_TOKEN'));

    const msg = {
      to: destinatarios,
      from: 'noreply@base44.com',
      subject: `Relatório Mensal de Atendimento - ${inicioMesAnterior.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Relatório Mensal de Atendimento</h2>
          <p><strong>Escritório:</strong> ${escritorio.nome}</p>
          <p><strong>Período:</strong> ${inicioMesAnterior.toLocaleDateString('pt-BR')} - ${fimMesAnterior.toLocaleDateString('pt-BR')}</p>
          
          <h3>Resumo do Mês</h3>
          <ul>
            <li><strong>Total de tickets:</strong> ${tickets.length}</li>
            <li><strong>Resolvidos:</strong> ${tickets.filter(t => t.status === 'resolvido').length}</li>
            <li><strong>Em atendimento:</strong> ${tickets.filter(t => t.status === 'em_atendimento').length}</li>
            <li><strong>Alta prioridade:</strong> ${tickets.filter(t => t.prioridade === 'alta').length}</li>
          </ul>
          
          <p>Relatório detalhado em anexo.</p>
        </div>
      `,
      attachments: [
        {
          content: pdfBase64,
          filename: `relatorio-${inicioMesAnterior.getFullYear()}-${String(inicioMesAnterior.getMonth() + 1).padStart(2, '0')}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };

    await sgMail.send(msg);

    return Response.json({ 
      success: true, 
      tickets_count: tickets.length,
      enviado_para: destinatarios.length 
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});