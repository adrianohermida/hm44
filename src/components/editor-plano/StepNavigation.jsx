import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function StepNavigation({ steps, current, onStepClick, canAdvance }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {steps.map((step, idx) => {
        const StepIcon = step.icon;
        const active = idx === current;
        const completed = idx < current;
        const enabled = canAdvance(idx);
        
        return (
          <Badge
            key={step.id}
            variant={active ? "default" : completed ? "secondary" : "outline"}
            className={`whitespace-nowrap text-xs ${
              enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            } ${active ? 'bg-[var(--brand-primary)]' : ''}`}
            onClick={() => enabled && onStepClick(idx)}
          >
            <StepIcon className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">{step.title}</span>
            <span className="sm:hidden">{idx + 1}</span>
          </Badge>
        );
      })}
    </div>
  );
}