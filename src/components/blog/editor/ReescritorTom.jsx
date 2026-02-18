import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ReescritorTom({ topicos, onAplicarReescrita }) {
  const [reescrevendo, setReescrevendo] = useState(false);
  const [tom, setTom] = useState('formal');
  const [topicoId, setTopicoId] = useState('');

  const reescrever = async () => {
    const topico = topicos.find(t => t.id === parseInt(topicoId));
    if (!topico || !topico.texto) {
      toast.error('Selecione um tópico válido');
      return;
    }

    setReescrevendo(true);
    try {
      const tons = {
        formal: 'linguagem jurídica formal e técnica',
        informal: 'linguagem acessível e didática para leigos',
        tecnico: 'linguagem técnica com termos especializados',
        persuasivo: 'linguagem persuasiva e com gatilhos de conversão',
        empático: 'linguagem empática e acolhedora para clientes'
      };

      const novoTexto = await base44.integrations.Core.InvokeLLM({
        prompt: `Reescreva este texto com tom ${tons[tom]}:

"${topico.texto}"

Mantenha o mesmo comprimento e informação, apenas mude o tom.`
      });

      const topicosAtualizados = topicos.map(t =>
        t.id === topico.id ? { ...t, texto: novoTexto.trim() } : t
      );

      onAplicarReescrita(topicosAtualizados);
      toast.success(`✅ Texto reescrito com tom ${tom}`);
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setReescrevendo(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-600" />
          Reescrever Tom
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs">Selecionar Seção</Label>
          <Select value={topicoId} onValueChange={setTopicoId}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Escolha um tópico" />
            </SelectTrigger>
            <SelectContent>
              {topicos.filter(t => t.texto && t.texto.length > 50).map(t => (
                <SelectItem key={t.id} value={String(t.id)}>
                  <Badge variant="outline" className="mr-2 text-xs">{t.tipo}</Badge>
                  {t.texto.substring(0, 40)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Tom Desejado</Label>
          <Select value={tom} onValueChange={setTom}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal/Jurídico</SelectItem>
              <SelectItem value="informal">Informal/Didático</SelectItem>
              <SelectItem value="tecnico">Técnico/Especializado</SelectItem>
              <SelectItem value="persuasivo">Persuasivo/Conversão</SelectItem>
              <SelectItem value="empático">Empático/Acolhedor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={reescrever} disabled={reescrevendo || !topicoId} size="sm" className="w-full">
          {reescrevendo ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-2" />}
          Reescrever
        </Button>
      </CardContent>
    </Card>
  );
}