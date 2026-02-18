import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';

export default function ModuloNav() {
  const location = useLocation();
  const items = [
    { label: 'Provedores', path: createPageUrl('AdminProvedores') },
    { label: 'Endpoints', path: createPageUrl('AdminEndpoints') },
    { label: 'Callbacks', path: createPageUrl('AdminCallbacks') },
    { label: 'Docker API', path: createPageUrl('DockerAPI') },
    { label: 'Precificador', path: createPageUrl('Precificador') },
    { label: 'Testar APIs', path: createPageUrl('TesteEndpointPage') },
    { label: 'Histórico', path: createPageUrl('AdminTestes') },
    { label: 'Alertas', path: createPageUrl('ConfiguracaoAlertas') },
    { label: 'Analytics', path: createPageUrl('AnalyticsConsumo') }
  ];

  return (
    <nav className="flex gap-2 mb-6 overflow-x-auto" aria-label="Navegação de submódulos">
      {items.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center",
            location.pathname === item.path
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
          )}
          aria-current={location.pathname === item.path ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}