import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function CSVTemplateDownload() {
  const handleDownload = () => {
    const template = [
      ['numero_cnj', 'titulo', 'cliente_cpf_cnpj', 'tribunal', 'classe', 'assunto', 'valor_causa', 'data_distribuicao', 'observacoes'],
      ['00012345620258150000', 'Ação Trabalhista', '12345678900', 'TRT15', 'Reclamação Trabalhista', 'Horas Extras', '50000', '2025-01-15', 'Cliente principal'],
      ['00098765420258260000', 'Ação Cível', '98765432100', 'TJSP', 'Procedimento Comum', 'Indenização', '100000', '2025-01-10', '']
    ];

    const csv = template.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_processos.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDownload}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      Baixar Template CSV
    </Button>
  );
}