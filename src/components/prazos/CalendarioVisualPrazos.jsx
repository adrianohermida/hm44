import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useCalendarioPrazos } from './hooks/useCalendarioPrazos';
import CalendarioDayCell from './CalendarioDayCell';
import CalendarioPrazosLista from './CalendarioPrazosLista';

export default function CalendarioVisualPrazos() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { prazos, isLoading, getPrazosNaData } = useCalendarioPrazos(selectedDate);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="animate-pulse h-80 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendário de Prazos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasPrazos: (date) => getPrazosNaData(date).length > 0
            }}
            modifiersClassNames={{
              hasPrazos: 'relative font-bold bg-[--brand-primary-100]'
            }}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      <CalendarioPrazosLista date={selectedDate} prazos={getPrazosNaData(selectedDate)} />
    </div>
  );
}