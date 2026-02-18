import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, Calendar } from 'lucide-react';

export default function VideoFilters({ currentFilter, onFilterChange }) {
  const filters = [
    { id: 'date', label: 'Mais Recentes', icon: Clock },
    { id: 'viewCount', label: 'Em Alta', icon: TrendingUp },
    { id: 'rating', label: 'Mais Curtidos', icon: Calendar },
  ];

  return (
    <div className="flex gap-3 mb-8 justify-center flex-wrap">
      {filters.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          onClick={() => onFilterChange(id)}
          variant={currentFilter === id ? 'default' : 'outline'}
          className={currentFilter === id ? 'bg-[var(--brand-primary)]' : ''}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
}