import React from 'react';
import { useTeamEvents } from '@/components/hooks/useTeamEvents';
import TeamEventsWidget from './TeamEventsWidget';

export default function TeamEventsLoader() {
  const { events, loading } = useTeamEvents();

  return <TeamEventsWidget events={events} loading={loading} />;
}