import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Star } from 'lucide-react';

export default function ProofCard({ proof, onApprove, onReject, showActions = false }) {
  const typeColors = {
    depoimento: 'bg-blue-500',
    reconhecimento: 'bg-purple-500',
    publicacao: 'bg-green-500',
    midia: 'bg-orange-500',
    premio: 'bg-yellow-500'
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between mb-3">
          <Badge className={typeColors[proof.tipo]}>{proof.tipo}</Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{proof.score_credibilidade}</span>
          </div>
        </div>
        <h3 className="font-bold text-[var(--text-primary)] mb-2">{proof.titulo}</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-3">{proof.descricao}</p>
        <p className="text-xs text-[var(--text-tertiary)] italic mb-3">
          - {proof.autor} ({proof.cargo_contexto})
        </p>
        {proof.justificativa_conformidade && (
          <p className="text-xs bg-green-50 p-2 rounded mb-3">
            ✅ {proof.justificativa_conformidade}
          </p>
        )}
        {showActions && proof.status === 'pendente' && (
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={() => onApprove(proof.id)} className="bg-green-600">
              <Check className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => onReject(proof.id)} variant="destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}