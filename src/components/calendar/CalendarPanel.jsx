import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCalendarEvents } from '@/components/hooks/useCalendarEvents';
import { useAvailabilitySlots } from '@/components/hooks/useAvailabilitySlots';
import CalendarSyncStatus from './CalendarSyncStatus';
import CalendarEventsList from './CalendarEventsList';
import CalendarAvailabilitySlots from './CalendarAvailabilitySlots';
import DateSelector from './DateSelector';

export default function CalendarPanel() {
  const [date, setDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const { events, loading: eventsLoading } = useCalendarEvents(true);
  const { slots, loading: slotsLoading, loadSlots } = useAvailabilitySlots(date);

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Agenda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CalendarSyncStatus connected={true} />
        <Tabs defaultValue="slots">
          <TabsList className="w-full">
            <TabsTrigger value="slots" className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Horários
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Compromissos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="slots" className="space-y-4">
            <DateSelector date={date} onChange={(d) => { setDate(d); loadSlots(); }} />
            <CalendarAvailabilitySlots slots={slots} loading={slotsLoading} isAdmin={isAdmin} />
          </TabsContent>
          <TabsContent value="events">
            <CalendarEventsList events={events} loading={eventsLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}