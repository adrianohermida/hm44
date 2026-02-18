import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { honorarioId } = await req.json();

    if (!honorarioId) {
      return new Response(JSON.stringify({ error: 'honorarioId required' }), { status: 400 });
    }

    const honorario = await base44.entities.Honorario.get(honorarioId);
    if (!honorario) {
      return new Response(JSON.stringify({ error: 'Fatura não encontrada' }), { status: 404 });
    }

    const { jsPDF } = await import('npm:jspdf@2.5.2');
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('FATURA / RECIBO', 20, 20);

    // Número e data
    doc.setFontSize(10);
    doc.text(`Fatura #${honorarioId.slice(-6).toUpperCase()}`, 20, 35);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);

    // Informações
    doc.setFontSize(11);
    let yPos = 65;

    doc.text('Resumo da Fatura:', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.text(`Valor Total: R$ ${(honorario.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 8;

    doc.text(`Valor Pago: R$ ${(honorario.valor_pago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 8;

    const pendente = (honorario.valor_total || 0) - (honorario.valor_pago || 0);
    doc.text(`Pendente: R$ ${pendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 12;

    doc.text(`Tipo: ${honorario.tipo || 'Não especificado'}`, 20, yPos);
    yPos += 8;

    doc.text(`Modalidade: ${honorario.modalidade || 'Não especificada'}`, 20, yPos);
    yPos += 8;

    doc.text(`Status: ${honorario.status || 'Pendente'}`, 20, yPos);
    yPos += 12;

    if (honorario.parcelas && honorario.parcelas.length > 0) {
      doc.setFontSize(11);
      doc.text('Parcelas:', 20, yPos);
      yPos += 10;

      doc.setFontSize(9);
      honorario.parcelas.slice(0, 5).forEach((parcela, idx) => {
        const parcelaText = `${idx + 1}. R$ ${(parcela.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} - Venc: ${new Date(parcela.vencimento).toLocaleDateString('pt-BR')} - ${parcela.status || 'pendente'}`;
        doc.text(parcelaText, 20, yPos);
        yPos += 7;
      });

      if (honorario.parcelas.length > 5) {
        doc.text(`... e mais ${honorario.parcelas.length - 5} parcelas`, 20, yPos);
      }
    }

    // Footer
    doc.setFontSize(8);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 270);

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=fatura-${honorarioId.slice(-6)}.pdf`
      }
    });

  } catch (error) {
    console.error('Erro ao exportar fatura PDF:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});