import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ExportButton({ filtros, escritorioId, userEmail }) {
  const exportPDFMutation = useMutation({
    mutationFn: () => base44.functions.invoke('helpdesk/exportarRelatorioPDF', {
      filtros,
      escritorio_id: escritorioId,
      usuario_email: userEmail
    }),
    onSuccess: (response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF exportado');
    },
    onError: () => toast.error('Erro ao exportar PDF')
  });

  const exportExcelMutation = useMutation({
    mutationFn: () => base44.functions.invoke('helpdesk/exportarRelatorioExcel', {
      filtros,
      escritorio_id: escritorioId,
      usuario_email: userEmail
    }),
    onSuccess: (response) => {
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Excel exportado');
    },
    onError: () => toast.error('Erro ao exportar Excel')
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={exportPDFMutation.isPending || exportExcelMutation.isPending}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportPDFMutation.mutate()}>
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportExcelMutation.mutate()}>
          Exportar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}