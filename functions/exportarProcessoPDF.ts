import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@2.5.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { processo_id } = await req.json();

    if (!processo_id) {
      return Response.json({ error: 'processo_id obrigatório' }, { status: 400 });
    }

    // Buscar dados do processo
    const processos = await base44.entities.Processo.filter({ id: processo_id });
    if (!processos.length) {
      return Response.json({ error: 'Processo não encontrado' }, { status: 404 });
    }
    const processo = processos[0];

    // Buscar partes, movimentações, etc
    const [partes, movimentacoes, prazos, audiencias] = await Promise.all([
      base44.entities.ProcessoParte.filter({ processo_id }),
      base44.entities.MovimentacaoProcesso.filter({ processo_id }),
      base44.entities.Prazo.filter({ processo_id, tipo: 'prazo_processual' }),
      base44.entities.ProcessoAudienciaEscavador.filter({ processo_id })
    ]);

    // Gerar PDF
    const doc = new jsPDF();
    let y = 20;

    // Título
    doc.setFontSize(16);
    doc.text('Relatório do Processo', 20, y);
    y += 15;

    // Dados básicos
    doc.setFontSize(10);
    doc.text(`CNJ: ${processo.numero_cnj || 'N/A'}`, 20, y);
    y += 7;
    doc.text(`Tribunal: ${processo.tribunal || 'N/A'}`, 20, y);
    y += 7;
    doc.text(`Classe: ${processo.classe || 'N/A'}`, 20, y);
    y += 7;
    doc.text(`Assunto: ${processo.assunto || 'N/A'}`, 20, y);
    y += 10;

    // Partes
    doc.setFontSize(12);
    doc.text('Partes:', 20, y);
    y += 7;
    doc.setFontSize(10);
    partes.forEach(parte => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${parte.tipo_parte}: ${parte.nome}`, 25, y);
      y += 6;
    });
    y += 5;

    // Movimentações (últimas 10)
    doc.setFontSize(12);
    doc.text('Últimas Movimentações:', 20, y);
    y += 7;
    doc.setFontSize(10);
    movimentacoes.slice(0, 10).forEach(mov => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const data = new Date(mov.data).toLocaleDateString('pt-BR');
      doc.text(`${data}: ${mov.conteudo.substring(0, 80)}`, 25, y);
      y += 6;
    });

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=processo-${processo.numero_cnj || 'relatorio'}.pdf`
      }
    });
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});