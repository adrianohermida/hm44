import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Navegação estrutural" className="mb-6">
      <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center gap-2">
          <Link 
            to={createPageUrl("Home")} 
            itemProp="item"
            className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
            aria-label="Voltar para página inicial"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span itemProp="name">Início</span>
          </Link>
          <meta itemProp="position" content="1" />
          <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
        </li>
        {items.map((item, index) => (
          <li 
            key={index} 
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-2"
          >
            {item.url ? (
              <>
                <Link 
                  to={item.url} 
                  itemProp="item"
                  className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
                <meta itemProp="position" content={index + 2} />
                {index < items.length - 1 && <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />}
              </>
            ) : (
              <>
                <span itemProp="name" className="text-[var(--text-primary)] font-semibold" aria-current="page">
                  {item.label}
                </span>
                <meta itemProp="position" content={index + 2} />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}