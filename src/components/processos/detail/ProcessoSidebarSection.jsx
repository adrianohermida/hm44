import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProcessoSidebarSection({ title, children, collapsible = false, defaultOpen = true }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  if (!collapsible) return <div className="space-y-4">{children}</div>;

  return (
    <div className="border-t border-[var(--border-primary)] pt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between mb-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <span className="font-semibold text-sm uppercase tracking-wide">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
      {isOpen && <div className="space-y-4">{children}</div>}
    </div>
  );
}