import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DatajudWorkspaceConfig({ darkMode = false }) {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState({
    auto_sync: false,
    frequencia_horas: 24,
    notificar_novos_movimentos: true
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio-config'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações de Sincronização
        </CardTitle>
        <CardDescription>
          Configure o monitoramento automático DataJud
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Label>Sincronização Automática Diária</Label>
          <Switch
            checked={config.auto_sync}
            onCheckedChange={(checked) => setConfig({ ...config, auto_sync: checked })}
          />
        </div>

        {config.auto_sync && (
          <div>
            <Label className="mb-2 block">Frequência (horas)</Label>
            <Input
              type="number"
              min="1"
              max="168"
              value={config.frequencia_horas}
              onChange={(e) => setConfig({ ...config, frequencia_horas: parseInt(e.target.value) })}
            />
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Label>Notificar Novos Movimentos</Label>
          <Switch
            checked={config.notificar_novos_movimentos}
            onCheckedChange={(checked) => setConfig({ ...config, notificar_novos_movimentos: checked })}
          />
        </div>

        <Button
          onClick={() => toast.success('Configuração salva!')}
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
}