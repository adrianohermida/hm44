import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import RelatorioSalvarFiltroModal from './RelatorioSalvarFiltroModal';

export default function RelatorioFiltros({ filtros, onChange, escritorioId, userEmail }) {
  const [salvarOpen, setSalvarOpen] = React.useState(false);

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos', escritorioId],
    queryFn: () => base44.entities.Departamento.filter({ escritorio_id: escritorioId, ativo: true }),
    enabled: !!escritorioId
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Status</label>
            <Select value={filtros.status || 'todos'} onValueChange={(v) => onChange({...filtros, status: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aberto">Abertos</SelectItem>
                <SelectItem value="resolvido">Resolvidos</SelectItem>
                <SelectItem value="fechado">Fechados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Departamento</label>
            <Select value={filtros.departamento_id || 'todos'} onValueChange={(v) => onChange({...filtros, departamento_id: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {departamentos.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Período</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {filtros.dataInicio ? format(new Date(filtros.dataInicio), 'dd/MM/yyyy') : 'Selecionar'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="range"
                  selected={{ from: filtros.dataInicio ? new Date(filtros.dataInicio) : undefined, to: filtros.dataFim ? new Date(filtros.dataFim) : undefined }}
                  onSelect={(range) => onChange({...filtros, dataInicio: range?.from, dataFim: range?.to})}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={() => setSalvarOpen(true)} variant="outline" size="sm" className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Salvar Filtros
          </Button>
        </CardContent>
      </Card>

      <RelatorioSalvarFiltroModal
        open={salvarOpen}
        onClose={() => setSalvarOpen(false)}
        filtros={filtros}
        escritorioId={escritorioId}
        userEmail={userEmail}
      />
    </>
  );
}