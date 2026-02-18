import { base44 } from '@/api/base44Client';

export function buildEventData(entity, type) {
  if (type === 'audiencia') {
    return {
      summary: `Audiência: ${entity.tipo}`,
      description: entity.pauta || '',
      start: entity.data_hora,
      end: new Date(new Date(entity.data_hora).getTime() + (entity.duracao_prevista || 60) * 60000).toISOString(),
      location: entity.local || ''
    };
  }
  return {};
}

export async function markEntitySynced(id, type) {
  const Entity = type === 'audiencia' ? base44.entities.Audiencia : base44.entities.Tarefa;
  await Entity.update(id, { google_calendar_synced: true });
}

export function generateBusinessHours(date, start = '09:00', end = '18:00') {
  const slots = [];
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  
  const startTime = new Date(date);
  startTime.setHours(startHour, startMin, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(endHour, endMin, 0, 0);
  
  const totalMinutes = (endTime - startTime) / 60000;
  const numSlots = Math.floor(totalMinutes / 30);
  
  for (let i = 0; i < numSlots; i++) {
    const slotStart = new Date(startTime.getTime() + i * 30 * 60000);
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
    slots.push({ start: slotStart, end: slotEnd });
  }
  
  return slots;
}

export function isEventOverlapping(event, slot, date) {
  const eventStart = new Date(event.start.dateTime || event.start.date);
  const slotStart = new Date(`${date}T${slot.inicio}`);
  return eventStart.getHours() === slotStart.getHours();
}