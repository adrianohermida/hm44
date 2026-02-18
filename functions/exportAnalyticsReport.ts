import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { format = 'pdf', dateRange = '30days' } = await req.json();

    // Fetch metrics
    const [processos, tickets, agendamentos] = await Promise.all([
      base44.entities.Processo.filter({ created_by: user.email }, '-created_date', 100),
      base44.entities.Ticket.filter({ created_by: user.email }, '-created_date', 100),
      base44.entities.Appointment.filter({ created_by: user.email }, '-created_date', 100)
    ]);

    const metrics = {
      totalProcessos: processos?.length || 0,
      totalTickets: tickets?.length || 0,
      totalAgendamentos: agendamentos?.length || 0,
      ticketsResolvidos: tickets?.filter(t => t.status === 'closed').length || 0,
      taxaResolucao: tickets?.length > 0 ? Math.round((tickets.filter(t => t.status === 'closed').length / tickets.length) * 100) : 0,
      geradoEm: new Date().toISOString(),
      usuario: user.full_name,
      email: user.email
    };

    if (format === 'json') {
      return Response.json({ success: true, metrics });
    }

    if (format === 'csv') {
      const csv = `Métrica,Valor\n` +
        `Total de Processos,${metrics.totalProcessos}\n` +
        `Total de Tickets,${metrics.totalTickets}\n` +
        `Total de Consultas,${metrics.totalAgendamentos}\n` +
        `Tickets Resolvidos,${metrics.ticketsResolvidos}\n` +
        `Taxa de Resolução,${metrics.taxaResolucao}%\n` +
        `Gerado em,${metrics.geradoEm}\n` +
        `Usuário,${metrics.usuario}`;

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename=analytics-report.csv'
        }
      });
    }

    // PDF format
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #10b981; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #10b981; color: white; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Relatório de Analytics</h1>
          <p><strong>Usuário:</strong> ${metrics.usuario}</p>
          <p><strong>Email:</strong> ${metrics.email}</p>
          <p><strong>Período:</strong> ${dateRange}</p>
          
          <table>
            <tr>
              <th>Métrica</th>
              <th>Valor</th>
            </tr>
            <tr>
              <td>Total de Processos</td>
              <td>${metrics.totalProcessos}</td>
            </tr>
            <tr>
              <td>Total de Tickets</td>
              <td>${metrics.totalTickets}</td>
            </tr>
            <tr>
              <td>Total de Consultas Agendadas</td>
              <td>${metrics.totalAgendamentos}</td>
            </tr>
            <tr>
              <td>Tickets Resolvidos</td>
              <td>${metrics.ticketsResolvidos}</td>
            </tr>
            <tr>
              <td>Taxa de Resolução</td>
              <td>${metrics.taxaResolucao}%</td>
            </tr>
          </table>
          
          <div class="footer">
            <p>Relatório gerado em: ${new Date(metrics.geradoEm).toLocaleDateString('pt-BR')} às ${new Date(metrics.geradoEm).toLocaleTimeString('pt-BR')}</p>
            <p>Hermida Maia Advocacia</p>
          </div>
        </body>
      </html>
    `;

    // Note: jsPDF/html2pdf would need to be used for real PDF generation
    // For now, returning HTML that can be converted to PDF on client
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'attachment; filename=analytics-report.html'
      }
    });

  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});