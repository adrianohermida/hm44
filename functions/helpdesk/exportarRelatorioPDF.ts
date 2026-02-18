import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@2.5.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filtros, escritorio_id, usuario_email } = await req.json();
    
    let query = { escritorio_id };
    if (filtros.status && filtros.status !== 'todos') {
      query.status = filtros.status;
    }
    if (filtros.departamento_id && filtros.departamento_id !== 'todos') {
      query.departamento_id = filtros.departamento_id;
    }
    
    const tickets = await base44.entities.Ticket.filter(query, '-created_date', 500);
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Relatório de Tickets', 20, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    doc.text(`Total de tickets: ${tickets.length}`, 20, 40);
    
    let y = 55;
    tickets.slice(0, 20).forEach((t, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${idx + 1}. ${t.titulo} - ${t.status}`, 20, y);
      y += 10;
    });
    
    // Registrar evento
    await base44.entities.RelatorioEvento.create({
      escritorio_id,
      tipo_relatorio: 'pdf',
      usuario_email,
      filtros_aplicados: filtros,
      total_tickets: tickets.length
    });
    
    const pdfBytes = doc.output('arraybuffer');
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=relatorio.pdf'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});