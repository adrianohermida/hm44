import React, { memo, useState, useRef } from 'react';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { Checkbox } from '@/components/ui/checkbox';
import ThreadCardActions from './ThreadCardActions';
import ThreadCardHeader from './ThreadCardHeader';
import ThreadCardContent from './ThreadCardContent';
import ThreadCardBadges from './ThreadCardBadges';
import { Archive, Trash2 } from 'lucide-react';

const ThreadCard = memo(function ThreadCard({ thread, isActive, isSelected, onClick, onToggleSelect, onMarkRead, onEscalate, onArchive }) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchOffset, setTouchOffset] = useState(0);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const currentTouch = e.touches[0].clientX;
    const offset = currentTouch - touchStart;
    if (Math.abs(offset) > 10) {
      e.preventDefault();
      setTouchOffset(Math.max(-150, Math.min(150, offset)));
    }
  };

  const handleTouchEnd = () => {
    if (touchOffset < -80) {
      onArchive(thread);
    } else if (touchOffset > 80) {
      onMarkRead(thread);
    }
    setTouchOffset(0);
  };

  const bgColor = thread.naoLida 
    ? 'bg-white' 
    : 'bg-gray-50';

  return (
    <div className="relative overflow-hidden">
      {touchOffset !== 0 && (
        <div className="absolute inset-0 flex items-center justify-between px-6 z-0">
          {touchOffset > 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <Trash2 className="w-5 h-5" />
              <span className="font-semibold">Descartar</span>
            </div>
          )}
          {touchOffset < 0 && (
            <div className="ml-auto flex items-center gap-2 text-blue-600">
              <span className="font-semibold">Arquivar</span>
              <Archive className="w-5 h-5" />
            </div>
          )}
        </div>
      )}
      
      <button
        ref={cardRef}
        onClick={onClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${touchOffset}px)`, transition: touchOffset === 0 ? 'transform 0.2s' : 'none' }}
        className={`group relative w-full text-left p-3 border-b hover:bg-gray-50 transition-colors z-10 ${
          isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : bgColor
        } ${isSelected ? 'bg-blue-100' : ''}`}
      >
        <ThreadCardActions thread={thread} onMarkRead={onMarkRead} onEscalate={onEscalate} onArchive={onArchive} />
        
        <div className="flex gap-2 items-start">
          {onToggleSelect && (
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect()}
                className="mt-1 flex-shrink-0"
              />
            </div>
          )}
          
          <CustomAvatar 
            fallback={thread.clienteNome?.charAt(0) || 'C'} 
            className={`h-9 w-9 flex-shrink-0 ${!thread.naoLida ? 'opacity-60' : ''}`}
          />
          
          <div className="flex-1 min-w-0">
            <ThreadCardHeader thread={thread} />
            <ThreadCardContent thread={thread} />
            <ThreadCardBadges thread={thread} />
          </div>
        </div>
      </button>
    </div>
  );
});

export default ThreadCard;