import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useDebounce from '@/components/hooks/useDebounce';

export default function GlobalSearchValidated({ escritorioId, onResultClick }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['global-search', debouncedQuery, escritorioId],
    queryFn: () => base44.functions.invoke('globalSearch', { 
      query: debouncedQuery,
      escritorio_id: escritorioId 
    }),
    enabled: debouncedQuery.length >= 3 && !!escritorioId,
    select: (response) => response.data || []
  });

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <Input
          placeholder="Buscar tickets, clientes, processos..."
          className="pl-9 pr-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[var(--brand-primary)]" />
        )}
      </div>

      {debouncedQuery.length >= 3 && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((result, idx) => (
            <a
              key={idx}
              href={result.url}
              onClick={(e) => {
                e.preventDefault();
                if (result.type === 'Ticket') {
                  window.location.href = result.url;
                } else {
                  window.location.href = result.url;
                }
                setQuery('');
              }}
              className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="font-medium text-sm">{result.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{result.type}</span>
                {result.subtitle && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{result.subtitle}</span>
                  </>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      {debouncedQuery.length >= 3 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-50">
          <p className="text-sm text-gray-500 text-center">Nenhum resultado encontrado</p>
        </div>
      )}

      {debouncedQuery.length > 0 && debouncedQuery.length < 3 && (
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          Digite pelo menos 3 caracteres
        </p>
      )}
    </div>
  );
}