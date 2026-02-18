import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TEMPLATES = {
  tecnico: {
    nome: 'Modelo Técnico (completo)',
    headers: ['numero_cnj', 'titulo', 'tribunal', 'polo_ativo', 'polo_passivo', 'classe', 'assunto', 'area', 'instancia', 'orgao_julgador', 'data_distribuicao', 'valor_causa', 'status'],
    exemplo: ['10043856820238260292', 'Cliente x Empresa', 'TJSP', 'João Silva', 'Empresa XYZ', 'Procedimento Comum', 'Dano Moral', 'Cível', '1ª Instância', '17ª Câmara', '2023-05-15', '50000', 'ativo']
  },
  juridico: {
    nome: 'Modelo Jurídico (simplificado)',
    headers: ['Processo', 'Tribunal', 'Polo Ativo', 'Polo Passivo', 'Classe', 'Assunto', 'Valor da causa', 'Data de distribuição'],
    exemplo: ['1004385-68.2023.8.26.0292', 'TJSP', 'João Silva', 'Empresa XYZ', 'Procedimento Comum', 'Dano Moral', 'R$ 50.000,00', '15/05/2023']
  },
  crm: {
    nome: 'Modelo CRM (HubSpot/Pipedrive)',
    headers: ['numero_processo', 'titulo', 'Pipeline', 'Associated Contact', 'tribunal', 'status_atual_processo'],
    exemplo: ['1004385-68.2023.8.26.0292', 'Ação de Cobrança', 'Processos Ativos', 'joao@email.com', 'TJSP', 'Em andamento']
  },
  hibrido: {
    nome: 'Modelo Híbrido',
    headers: ['Processo', 'Título', 'Tribunal', 'Polo Ativo', 'Polo Passivo', 'Apensos', 'Status'],
    exemplo: ['1004385-68.2023.8.26.0292', 'Cliente x Empresa', 'TJSP', 'João Silva', 'Empresa XYZ', '0001714-89.2023.8.26.0292', 'Ativo']
  }
};

export default function CSVTemplateGenerator() {
  const [modelo, setModelo] = React.useState('juridico');

  const handleDownload = () => {
    const template = TEMPLATES[modelo];
    const csv = [template.headers.join(','), template.exemplo.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_processos_${modelo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={modelo} onValueChange={setModelo}>
        <SelectTrigger className="w-[250px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TEMPLATES).map(([key, tmpl]) => (
            <SelectItem key={key} value={key}>{tmpl.nome}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="w-4 h-4 mr-2" />
        Baixar Template
      </Button>
    </div>
  );
}