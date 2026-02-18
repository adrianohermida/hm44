import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function EventSchedule({ schedule }) {
  return (
    <div className="space-y-4">
      {schedule.map((item, index) => (
        <Card key={index} className="border-l-4 border-[var(--brand-primary)]">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <div className="flex items-center gap-2 text-[var(--brand-primary)] font-semibold">
                <Clock className="w-4 h-4" />
                <span>{item.horario}</span>
              </div>
              {item.local && (
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{item.local}</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              {item.titulo}
            </h3>
            {item.palestrante && (
              <p className="text-sm text-[var(--text-secondary)]">
                {item.palestrante}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}