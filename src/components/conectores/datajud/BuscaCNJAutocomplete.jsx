import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CNJParser from '@/components/utils/CNJParser';

export default function BuscaCNJAutocomplete({ value, onChange, placeholder = "Digite o CNJ..." }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [sugestoes, setSugestoes] = useState([]);

  // Buscar processos recentes para sugestões
  const { data: processosRecentes = [] } = useQuery({
    queryKey: ['processos-recentes-cnj'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      if (!escritorios[0]) return [];
      
      return await base44.entities.Processo.filter({
        escritorio_id: escritorios[0].id
      }, '-created_date', 20);
    }
  });

  useEffect(() => {
    if (inputValue.length >= 4) {
      const matches = processosRecentes.filter(p => 
        p.numero_cnj?.includes(inputValue.replace(/\D/g, ''))
      ).slice(0, 5);
      setSugestoes(matches);
    } else {
      setSugestoes([]);
    }
  }, [inputValue, processosRecentes]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    
    // Formatação automática do CNJ
    const digits = newValue.replace(/\D/g, '');
    if (digits.length === 20) {
      const formatted = `${digits.slice(0,7)}-${digits.slice(7,9)}.${digits.slice(9,13)}.${digits.slice(13,14)}.${digits.slice(14,16)}.${digits.slice(16,20)}`;
      const parsed = CNJParser.parse(formatted);
      
      if (parsed.valido) {
        onChange(formatted);
        setOpen(false);
      }
    } else {
      onChange(newValue);
    }
  };

  const handleSelectSugestao = (processo) => {
    const formatted = CNJParser.format(processo.numero_cnj);
    setInputValue(formatted);
    onChange(formatted);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </PopoverTrigger>
        
        {sugestoes.length > 0 && (
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup heading="Processos Recentes">
                  {sugestoes.map((processo) => {
                    const formatted = CNJParser.format(processo.numero_cnj);
                    return (
                      <CommandItem
                        key={processo.id}
                        onSelect={() => handleSelectSugestao(processo)}
                        className="cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="font-mono text-sm font-medium">{formatted}</p>
                          <p className="text-xs text-gray-500 truncate">{processo.titulo}</p>
                        </div>
                        {processo.tribunal && (
                          <Badge variant="outline" className="ml-2">{processo.tribunal}</Badge>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
      
      {inputValue.length >= 4 && inputValue.length < 20 && (
        <p className="text-xs text-gray-500 mt-1">
          {20 - inputValue.replace(/\D/g, '').length} dígitos restantes
        </p>
      )}
    </div>
  );
}