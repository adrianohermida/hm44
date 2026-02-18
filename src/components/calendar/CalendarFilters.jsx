import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarFilters({ onRangeChange }) {
  const handleToday = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    onRangeChange(start.toISOString(), end.toISOString());
  };

  const handleWeek = () => {
    const start = new Date();
    const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    onRangeChange(start.toISOString(), end.toISOString());
  };

  const handleMonth = () => {
    const start = new Date();
    const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    onRangeChange(start.toISOString(), end.toISOString());
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" size="sm" onClick={handleToday}>
        <Calendar className="w-4 h-4 mr-2" />
        Hoje
      </Button>
      <Button variant="outline" size="sm" onClick={handleWeek}>
        Semana
      </Button>
      <Button variant="outline" size="sm" onClick={handleMonth}>
        Mês
      </Button>
    </div>
  );
}