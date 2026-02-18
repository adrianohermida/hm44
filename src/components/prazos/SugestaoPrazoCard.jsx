import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function SugestaoPrazoCard({ sugestao }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <span className="font-medium text-[var(--text-primary)]">Sugestão da IA</span>
        <Badge className="ml-auto bg-purple-100 text-purple-800">
          {sugestao.confianca}% confiança
        </Badge>
      </div>
      
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {sugestao.tipo_prazo}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          {sugestao.dias} dias • Vencimento: {format(new Date(sugestao.data_vencimento), 'dd/MM/yyyy')}
        </p>
      </div>

      {sugestao.palavras_chave?.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {sugestao.palavras_chave.map(palavra => (
            <Badge key={palavra} variant="outline" className="text-xs">
              {palavra}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}