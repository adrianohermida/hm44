import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

export default function DateSelector({ date, onChange }) {
  const handlePrev = () => onChange(subDays(date, 1));
  const handleNext = () => onChange(addDays(date, 1));
  const handleToday = () => onChange(new Date());

  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" size="sm" onClick={handlePrev}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div className="text-center">
        <p className="font-semibold text-[var(--text-primary)]">{format(date, 'dd/MM/yyyy')}</p>
        <p className="text-xs text-[var(--text-secondary)]">{format(date, 'EEEE')}</p>
      </div>
      <Button variant="outline" size="sm" onClick={handleNext}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}