import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save } from 'lucide-react';
import { useEditarPrazoAprendizado } from './hooks/useEditarPrazoAprendizado';
import EditarPrazoFields from './EditarPrazoFields';

export default function EditarPrazoComAprendizado({ prazo, onClose }) {
  const [data, setData] = useState(prazo);
  const { updateMutation, aprendizadoMutation } = useEditarPrazoAprendizado(prazo);

  const handleSave = () => {
    const ajustou = data.data_vencimento !== prazo.data_vencimento || data.tipo_prazo !== prazo.tipo_prazo;

    updateMutation.mutate(data, {
      onSuccess: () => {
        if (prazo.origem_calculo === 'ia' && ajustou) {
          aprendizadoMutation.mutate({
            aceito: false,
            ajustou: true,
            tipo_prazo_final: data.tipo_prazo,
            dias_final: Math.ceil((new Date(data.data_vencimento) - new Date(prazo.data_publicacao)) / (1000 * 60 * 60 * 24))
          });
        }
        onClose();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Editar Prazo</span>
          {prazo.origem_calculo === 'ia' && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              IA {prazo.confianca_ia}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <EditarPrazoFields data={data} setData={setData} />
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}