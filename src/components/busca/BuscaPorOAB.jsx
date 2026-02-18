import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function BuscaPorOAB({ onResultados = () => {} }) {
  const [numero, setNumero] = useState('');
  const [estado, setEstado] = useState('SP');
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!numero) return toast.error('Informe o número OAB');
    
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('buscarProcessosPorOAB', { 
        oab_numero: numero,
        oab_estado: estado
      });

      if (data.advogado_encontrado) {
        toast.info(`Advogado: ${data.advogado_encontrado.nome} (${data.advogado_encontrado.quantidade_processos} processos)`);
      }

      onResultados({ 
        processos: data.processos || [], 
        processos_salvos: data.processos_salvos || 0 
      });
      toast.success(`${data.processos_salvos || 0} processo(s) adicionado(s) | ${data.creditos_consumidos} créditos`);
    } catch (err) {
      toast.error(err.message || 'Erro na busca');
      onResultados({ processos: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Número OAB *</Label>
          <Input 
            placeholder="123456"
            value={numero}
            onChange={(e) => setNumero(e.target.value.replace(/\D/g, ''))}
            disabled={loading}
            type="number"
          />
        </div>
        <div>
          <Label>Estado *</Label>
          <Select value={estado} onValueChange={setEstado} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_BR.map(uf => (
                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-[var(--text-tertiary)]">
        Retorna processos em que o advogado atuou
      </p>
      <Button onClick={buscar} disabled={loading || !numero} className="w-full">
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {loading ? 'Buscando...' : 'Buscar Processos'}
      </Button>
    </div>
  );
}