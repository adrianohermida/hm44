import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { filterType, prazos } = await req.json();

    const { jsPDF } = await import('npm:jspdf@2.5.2');
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('RELATÓRIO DE PRAZOS', 20, 20);

    doc.setFontSize(12);
    const titulo = filterType === 'vencidos' ? 'Prazos Vencidos' : 'Prazos Próximos (7 dias)';
    doc.text(titulo, 20, 35);

    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 45);

    // Resumo
    doc.setFontSize(11);
    doc.text(`Total de Prazos: ${prazos.length}`, 20, 60);

    // Tabela
    let yPos = 75;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(9);
    doc.text('Nº', 20, yPos);
    doc.text('Prazo', 35, yPos);
    doc.text('Vencimento', 110, yPos);
    doc.text('Status', 160, yPos);

    yPos += 8;
    doc.setDrawColor(200);
    doc.line(20, yPos - 2, 190, yPos - 2);

    prazos.forEach((prazo, idx) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(`${idx + 1}`, 20, yPos);
      
      const titulo = doc.splitTextToSize(prazo.titulo, 70);
      doc.text(titulo, 35, yPos);
      
      const dataFormatada = new Date(prazo.data_vencimento).toLocaleDateString('pt-BR');
      doc.text(dataFormatada, 110, yPos);
      
      const status = prazo.status || 'pendente';
      doc.text(status, 160, yPos);

      yPos += 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.text(`Relatório de Prazos - ${new Date().getFullYear()}`, 20, pageHeight - 10);

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=relatorio-prazos-${filterType}-${new Date().toISOString().split('T')[0]}.pdf`
      }
    });

  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});