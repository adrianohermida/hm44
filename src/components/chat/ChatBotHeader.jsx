import React from 'react';
import { X, History, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatBotHeader({ onClose, title, view, onViewChange, onBack }) {
  return (
    <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between bg-[var(--brand-primary)] text-white rounded-t-lg">
      <div className="flex items-center gap-2">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="flex items-center gap-1">
        {view !== 'history' && !onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewChange(view === 'bot' ? 'history' : 'bot')}
            className="text-white hover:bg-white/20"
          >
            {view === 'bot' ? <History className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}