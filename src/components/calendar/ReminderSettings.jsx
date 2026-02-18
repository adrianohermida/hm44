import React from 'react';
import { Bell } from 'lucide-react';
import ReminderControl from './reminder/ReminderControl';
import ReminderApplicator from './reminder/ReminderApplicator';

export default function ReminderSettings({ value, onChange, onApplyToAll, eventCount, applying }) {
  return (
    <div className="bg-[var(--bg-elevated)] rounded-lg p-4 border border-[var(--border-primary)]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[var(--brand-primary)]" aria-hidden="true" />
          <h3 className="font-semibold text-[var(--text-primary)]">Lembretes</h3>
        </div>
        <div className="flex items-center gap-4">
          <ReminderControl value={value} onChange={onChange} />
          {onApplyToAll && eventCount > 0 && (
            <ReminderApplicator 
              onApply={onApplyToAll} 
              applying={applying}
              count={eventCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}