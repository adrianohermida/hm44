import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Search, Users, FileText, Loader2, UserCircle, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import useDebounce from '@/components/hooks/useDebounce';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  deduplicatePartes,
  deduplicateAdvogados,
  filterClientes,
  filterProcessos,
  filterPartes,
  filterAdvogados
} from './utils/searchUtils';

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });

  const { data: clientes = [], isLoading: loadingClientes } = useQuery({
    queryKey: ['search-clientes', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      const all = await base44.entities.Cliente.filter({ 
        escritorio_id: escritorio[0].id 
      });
      return filterClientes(all, debouncedSearch).slice(0, 5);
    },
    enabled: !!escritorio?.length && debouncedSearch.length >= 2,
  });

  const { data: processos = [], isLoading: loadingProcessos } = useQuery({
    queryKey: ['search-processos', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      const all = await base44.entities.Processo.filter({ 
        escritorio_id: escritorio[0].id 
      });
      return filterProcessos(all, debouncedSearch).slice(0, 5);
    },
    enabled: !!escritorio?.length && debouncedSearch.length >= 2,
  });

  const { data: partes = [], isLoading: loadingPartes } = useQuery({
    queryKey: ['search-partes', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      const all = await base44.entities.ProcessoParte.filter({ 
        escritorio_id: escritorio[0].id 
      });
      const unique = deduplicatePartes(all);
      return filterPartes(unique, debouncedSearch).slice(0, 5);
    },
    enabled: !!escritorio?.length && debouncedSearch.length >= 2,
  });

  const { data: advogados = [], isLoading: loadingAdvogados } = useQuery({
    queryKey: ['search-advogados', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      const all = await base44.entities.ProcessoParte.filter({ 
        escritorio_id: escritorio[0].id 
      });
      const allAdv = all.flatMap(p => p.advogados || []);
      const unique = deduplicateAdvogados(allAdv);
      return filterAdvogados(unique, debouncedSearch).slice(0, 5);
    },
    enabled: !!escritorio?.length && debouncedSearch.length >= 2,
  });

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-[var(--brand-primary)] transition-colors w-full max-w-md"
      >
        <Search className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Buscar... (Ctrl+K)</span>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Buscar clientes, processos, partes, advogados..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>
            {search.length < 2 ? 'Digite ao menos 2 caracteres para buscar' : 'Nenhum resultado encontrado'}
          </CommandEmpty>
          
          {clientes.length > 0 && (
            <CommandGroup heading="Clientes">
              {clientes.map((cliente) => (
                <Link 
                  key={cliente.id} 
                  to={createPageUrl('ClienteDetalhes') + `?id=${cliente.id}`}
                  onClick={() => setOpen(false)}
                >
                  <CommandItem>
                    <Users className="w-4 h-4 mr-2" />
                    <span>{cliente.nome_completo}</span>
                    {cliente.cpf_cnpj && (
                      <span className="text-xs text-[var(--text-tertiary)] ml-2">{cliente.cpf_cnpj}</span>
                    )}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          )}

          {processos.length > 0 && (
            <CommandGroup heading="Processos">
              {processos.map((processo) => (
                <Link 
                  key={processo.id} 
                  to={createPageUrl('ProcessoDetails') + `?id=${processo.id}`}
                  onClick={() => setOpen(false)}
                >
                  <CommandItem>
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{processo.numero_cnj || processo.titulo}</span>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          )}

          {partes.length > 0 && (
            <CommandGroup heading="Partes">
              {partes.map((parte) => (
                <Link 
                  key={parte.id} 
                  to={createPageUrl('ParteDetalhes') + `?id=${parte.id}`}
                  onClick={() => setOpen(false)}
                >
                  <CommandItem>
                    <UserCircle className="w-4 h-4 mr-2" />
                    <span>{parte.nome}</span>
                    {parte.cpf_cnpj && (
                      <span className="text-xs text-[var(--text-tertiary)] ml-2">{parte.cpf_cnpj}</span>
                    )}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          )}

          {advogados.length > 0 && (
            <CommandGroup heading="Advogados">
              {advogados.map((adv, idx) => (
                <Link 
                  key={idx} 
                  to={createPageUrl('AdvogadoDetalhes') + `?cpf=${adv.cpf || ''}&nome=${encodeURIComponent(adv.nome)}`}
                  onClick={() => setOpen(false)}
                >
                  <CommandItem>
                    <Scale className="w-4 h-4 mr-2" />
                    <span>{adv.nome}</span>
                    {adv.oab_numero && adv.oab_uf && (
                      <span className="text-xs text-[var(--text-tertiary)] ml-2">OAB {adv.oab_numero}/{adv.oab_uf}</span>
                    )}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          )}

          {(loadingClientes || loadingProcessos || loadingPartes || loadingAdvogados) && debouncedSearch.length >= 2 && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--brand-primary)]" />
              <span className="text-sm text-[var(--text-secondary)] ml-2">Buscando...</span>
            </div>
          )}
          
          {search !== debouncedSearch && search.length >= 2 && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--text-tertiary)]" />
              <span className="text-xs text-[var(--text-tertiary)] ml-2">Digitando...</span>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}