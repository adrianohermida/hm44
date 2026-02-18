import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DateRangeFilter({ onRangeChange }) {
  const [range, setRange] = useState({ from: subDays(new Date(), 7), to: new Date() });
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: 'Hoje', getValue: () => ({ from: new Date(), to: new Date() }) },
    { label: 'Últimos 7 dias', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: 'Esta semana', getValue: () => ({ from: startOfWeek(new Date()), to: new Date() }) },
    { label: 'Este mês', getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
    { label: 'Últimos 30 dias', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) }
  ];

  const handlePreset = (preset) => {
    const newRange = preset.getValue();
    setRange(newRange);
    onRangeChange(newRange);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarIcon className="w-4 h-4 mr-2" />
          {format(range.from, 'dd/MM', { locale: ptBR })} - {format(range.to, 'dd/MM', { locale: ptBR })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          <div className="border-r p-3 space-y-1">
            {presets.map(preset => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                onClick={() => handlePreset(preset)}
                className="w-full justify-start"
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="p-3">
            <Calendar
              mode="range"
              selected={range}
              onSelect={(newRange) => {
                if (newRange?.from && newRange?.to) {
                  setRange(newRange);
                  onRangeChange(newRange);
                }
              }}
              locale={ptBR}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}