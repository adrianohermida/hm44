import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, UserCog } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProcessoMarcarClienteList from './ProcessoMarcarClienteList';

export default function ProcessoMarcarClienteModal({ 
  open, 
  onClose, 
  partes = [], 
  onMarcar, 
  loading,
  escritorioId
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [advogadoId, setAdvogadoId] = useState('');

  const { data: advogados = [] } = useQuery({
    queryKey: ['advogados-escritorio', escritorioId],
    queryFn: async () => {
      const users = await base44.entities.User.filter({});
      return users.filter(u => u.email.includes('@') && u.role);
    },
    enabled: open && !!escritorioId
  });

  const partesNaoClientes = partes.filter(p => !p.e_cliente_escritorio);
  const partesFiltradas = search
    ? partesNaoClientes.filter(p => 
        p.nome?.toLowerCase().includes(search.toLowerCase()) ||
        p.cpf_cnpj?.includes(search)
      )
    : partesNaoClientes;

  const toggleParte = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onMarcar({ parteIds: selected, advogadoId });
      setSelected([]);
      setSearch('');
      setAdvogadoId('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Marcar Partes como Clientes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-3 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
              <UserCog className="w-4 h-4" />
              Advogado Responsável
            </div>
            <Select value={advogadoId} onValueChange={setAdvogadoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar advogado da equipe..." />
              </SelectTrigger>
              <SelectContent>
                {advogados.map(adv => (
                  <SelectItem key={adv.id} value={adv.id}>
                    {adv.full_name} ({adv.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--text-tertiary)]">
              Este advogado será associado como representante legal das partes marcadas
            </p>
          </div>

          {!advogadoId ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <p className="text-sm">👆 Selecione um advogado responsável para continuar</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                <Input
                  placeholder="Buscar por nome ou CPF/CNPJ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex-1 min-h-0">
                <ProcessoMarcarClienteList
                  partes={partesFiltradas}
                  selected={selected}
                  onToggle={toggleParte}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!advogadoId || selected.length === 0 || loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Marcar {selected.length > 0 && `(${selected.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}