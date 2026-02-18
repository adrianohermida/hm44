import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import Papa from 'papaparse';
import { toast } from 'sonner';

export default function AnalyticsFilters({ dateRange, onDateRangeChange, onReset, tickets }) {
  const handleExportCSV = () => {
    const csv = Papa.unparse(tickets.map(t => ({
      'Número': t.numero_ticket,
      'Título': t.titulo,
      'Status': t.status,
      'Prioridade': t.prioridade,
      'Cliente': t.cliente_nome,
      'Criado em': new Date(t.created_date).toLocaleString('pt-BR')
    })));
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exportado');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(dateRange.from, 'dd/MM/yyyy')
              )
            ) : (
              'Selecionar período'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" onClick={onReset}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Resetar
      </Button>

      <Button variant="outline" size="sm" onClick={handleExportCSV}>
        <Download className="w-4 h-4 mr-2" />
        Exportar CSV
      </Button>
    </div>
  );
}