import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Single-hand navigation: botões no bottom, tamanho 48px
 * para fácil acesso com uma mão no mobile
 */
export default function SingleHandNav({ items, activeId, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[var(--bg-primary)] border-t border-[var(--border-primary)] safe-area-inset-bottom">
      <div className="flex justify-around">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex-1 h-12 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
              activeId === item.id
                ? 'bg-[var(--brand-primary)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
            aria-current={activeId === item.id ? 'page' : undefined}
          >
            {item.icon && <item.icon className="w-5 h-5" />}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}