import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { processoId, numero, titulo } = await req.json();

    if (!processoId) {
      return new Response(JSON.stringify({ error: 'processoId required' }), { status: 400 });
    }

    // Buscar processo
    const processo = await base44.entities.Processo.get(processoId);
    if (!processo) {
      return new Response(JSON.stringify({ error: 'Processo não encontrado' }), { status: 404 });
    }

    // Usar jsPDF para gerar PDF
    const { jsPDF } = await import('npm:jspdf@2.5.2');
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('RELATÓRIO DE PROCESSO JURÍDICO', 20, 20);

    // Informações básicas
    doc.setFontSize(12);
    doc.text(`Número CNJ: ${processo.numero_cnj || 'N/A'}`, 20, 40);
    doc.text(`Título: ${processo.titulo || 'N/A'}`, 20, 50);
    doc.text(`Status: ${processo.status || 'N/A'}`, 20, 60);

    // Detalhes
    doc.setFontSize(10);
    let yPos = 80;

    if (processo.tribunal) {
      doc.text(`Tribunal: ${processo.tribunal}`, 20, yPos);
      yPos += 10;
    }

    if (processo.area) {
      doc.text(`Área: ${processo.area}`, 20, yPos);
      yPos += 10;
    }

    if (processo.data_distribuicao) {
      doc.text(`Data de Distribuição: ${new Date(processo.data_distribuicao).toLocaleDateString('pt-BR')}`, 20, yPos);
      yPos += 10;
    }

    if (processo.polo_ativo) {
      doc.text(`Pólo Ativo: ${processo.polo_ativo}`, 20, yPos);
      yPos += 10;
    }

    if (processo.polo_passivo) {
      doc.text(`Pólo Passivo: ${processo.polo_passivo}`, 20, yPos);
      yPos += 10;
    }

    if (processo.observacoes) {
      doc.setFontSize(10);
      doc.text('Observações:', 20, yPos + 10);
      const observacoes = doc.splitTextToSize(processo.observacoes, 170);
      doc.text(observacoes, 20, yPos + 20);
    }

    // Footer
    doc.setFontSize(8);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 270);

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=processo-${numero || processo.id}.pdf`
      }
    });

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});