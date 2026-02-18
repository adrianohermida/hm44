import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Zap, Save } from 'lucide-react';

export default function AutoRespostaConfig({ escritorioId }) {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState({
    ativo: false,
    template_id: '',
    minutos_espera: 5
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates', escritorioId],
    queryFn: () => base44.entities.TemplateResposta.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.Escritorio.update(escritorioId, {
        auto_resposta_config: config
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['escritorio']);
      toast.success('Configuração salva');
    },
    onError: () => toast.error('Erro ao salvar')
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Resposta Automática
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Ativar resposta automática</Label>
          <Switch
            checked={config.ativo}
            onCheckedChange={(checked) => setConfig({ ...config, ativo: checked })}
          />
        </div>

        {config.ativo && (
          <>
            <div className="space-y-2">
              <Label>Template de Resposta</Label>
              <Select
                value={config.template_id}
                onValueChange={(value) => setConfig({ ...config, template_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Enviar após (minutos)</Label>
              <Input
                type="number"
                min={1}
                value={config.minutos_espera}
                onChange={(e) => setConfig({ ...config, minutos_espera: parseInt(e.target.value) })}
              />
            </div>
          </>
        )}

        <Button 
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || (config.ativo && !config.template_id)}
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configuração
        </Button>
      </CardContent>
    </Card>
  );
}