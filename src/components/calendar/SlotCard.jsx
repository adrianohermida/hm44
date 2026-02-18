import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SlotCard({ slot, isAdmin, onBook }) {
  const isAvailable = slot.status === 'available';
  
  return (
    <div className={`p-3 rounded-lg border transition-all ${
      isAvailable 
        ? 'border-[var(--brand-success)] bg-green-50 hover:shadow-md' 
        : 'border-[var(--border-primary)] bg-[var(--bg-secondary)]'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="font-medium text-[var(--text-primary)]">{slot.time}</span>
        </div>
        {isAvailable ? (
          <Badge className="bg-[var(--brand-success)]">
            <Check className="w-3 h-3 mr-1" />
            Livre
          </Badge>
        ) : (
          <Badge variant="secondary">
            <X className="w-3 h-3 mr-1" />
            Ocupado
          </Badge>
        )}
      </div>
      {!isAdmin && isAvailable && onBook && (
        <Button size="sm" className="w-full mt-2" onClick={() => onBook(slot)}>
          Agendar
        </Button>
      )}
    </div>
  );
}