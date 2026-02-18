import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function HelpdeskDateFilter({ dateRange, onDateRangeChange }) {
  const presets = [
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 30 dias', days: 30 },
    { label: 'Últimos 90 dias', days: 90 },
  ];

  const handlePreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onDateRangeChange({ from: start, to: end });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {presets.map(({ label, days }) => (
        <Button
          key={days}
          variant="outline"
          size="sm"
          onClick={() => handlePreset(days)}
        >
          {label}
        </Button>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd MMM', { locale: ptBR })} - {format(dateRange.to, 'dd MMM', { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, 'dd MMM yyyy', { locale: ptBR })
              )
            ) : (
              'Selecionar período'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}