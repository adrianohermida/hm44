import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

export default function PrazoFeedbackForm({ onSubmit, loading }) {
  const [showAjuste, setShowAjuste] = useState(false);
  const [diasAjustado, setDiasAjustado] = useState('');

  const handleAceitar = () => {
    onSubmit({ aceito: true });
  };

  const handleRejeitar = () => {
    if (showAjuste && diasAjustado) {
      onSubmit({ aceito: false, dias_ajustado: parseInt(diasAjustado) });
    } else {
      setShowAjuste(true);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">O cálculo automático está correto?</p>
      
      {showAjuste ? (
        <div className="space-y-2">
          <Label>Quantos dias corretos?</Label>
          <Input
            type="number"
            value={diasAjustado}
            onChange={(e) => setDiasAjustado(e.target.value)}
            placeholder="Ex: 15"
          />
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button size="sm" onClick={handleAceitar} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="outline" onClick={handleRejeitar} disabled={loading}>
          <ThumbsDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}