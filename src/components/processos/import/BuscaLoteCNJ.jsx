import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export default function BuscaLoteCNJ({ onClose }) {
  const [texto, setTexto] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const queryClient = useQueryClient();

  const extrairCNJs = (texto) => {
    const numeros = texto.replace(/[^0-9]/g, '');
    const cnjs = [];
    
    for (let i = 0; i <= numeros.length - 20; i++) {
      const potencial = numeros.substring(i, i + 20);
      if (potencial.length === 20 && !cnjs.includes(potencial)) {
        cnjs.push(potencial);
      }
    }
    
    return cnjs;
  };

  const buscarMutation = useMutation({
    mutationFn: async (cnjs) => {
      const response = await base44.functions.invoke('buscarLoteCNJ', { cnjs });
      return response.data;
    },
    onSuccess: (data) => {
      setResultados(data.resultados || []);
      queryClient.invalidateQueries(['processos']);
      toast.success(`${data.adicionados || 0} processos adicionados`);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro na busca');
    }
  });

  const handleBuscar = () => {
    const cnjs = extrairCNJs(texto);
    
    if (cnjs.length === 0) {
      toast.error('Nenhum CNJ válido encontrado');
      return;
    }

    if (cnjs.length > 40) {
      toast.error('Máximo de 40 CNJs por vez');
      return;
    }

    buscarMutation.mutate(cnjs);
  };

  const cnjs = extrairCNJs(texto);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Busca em Lote por CNJ</CardTitle>
        <CardDescription>
          Cole até 40 números CNJ separados por vírgula ou em texto livre
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="0616679-45.2017.8.04.0001, 5000506-23.2025.4.03.6133 ou cole texto contendo CNJs"
          className="min-h-32 font-mono text-sm"
        />

        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {cnjs.length} CNJ{cnjs.length !== 1 ? 's' : ''} detectado{cnjs.length !== 1 ? 's' : ''}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleBuscar} disabled={cnjs.length === 0 || buscarMutation.isPending}>
              {buscarMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Search className="w-4 h-4 mr-2" />
              Buscar {cnjs.length > 0 && `(${cnjs.length})`}
            </Button>
          </div>
        </div>

        {resultados.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {resultados.map((res, idx) => {
              const icons = {
                adicionado: { Icon: CheckCircle2, color: 'text-green-600', label: 'Adicionado' },
                duplicado: { Icon: AlertCircle, color: 'text-yellow-600', label: 'Duplicado' },
                erro: { Icon: AlertCircle, color: 'text-red-600', label: 'Erro' },
                processando: { Icon: Clock, color: 'text-blue-600', label: 'Processando' }
              };
              const config = icons[res.status] || icons.erro;
              const Icon = config.Icon;

              return (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <span className="font-mono text-sm flex-1">{res.cnj}</span>
                  <Badge variant={res.status === 'adicionado' ? 'default' : 'secondary'}>
                    {config.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}