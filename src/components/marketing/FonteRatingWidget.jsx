import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FonteRatingWidget({ fonte, onRatingUpdate }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [avaliando, setAvaliando] = useState(false);

  const handleRate = async (rating) => {
    setAvaliando(true);
    try {
      const novoTotal = (fonte.total_avaliacoes || 0) + 1;
      const novoScore = ((fonte.confiabilidade_score || 0) * (fonte.total_avaliacoes || 0) + rating) / novoTotal;

      await base44.entities.FonteRepositorio.update(fonte.id, {
        confiabilidade_score: novoScore,
        total_avaliacoes: novoTotal
      });

      onRatingUpdate();
      toast.success('Avaliação registrada!');
    } catch (error) {
      toast.error('Erro ao avaliar');
    } finally {
      setAvaliando(false);
    }
  };

  const mediaAtual = fonte.confiabilidade_score || 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={avaliando}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRate(star)}
            className="p-1 hover:scale-110 transition-transform disabled:opacity-50"
          >
            <Star
              className={`w-4 h-4 ${
                star <= (hoveredRating || mediaAtual)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-600">
        {mediaAtual.toFixed(1)} ({fonte.total_avaliacoes || 0})
      </span>
    </div>
  );
}