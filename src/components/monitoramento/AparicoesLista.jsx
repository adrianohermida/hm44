import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Star } from 'lucide-react';
import AparicaoModal from './AparicaoModal';

export default function AparicoesLista({ aparicoes, onUpdate }) {
  const [selectedAparicao, setSelectedAparicao] = useState(null);

  return (
    <>
      <div className="space-y-2">
        {aparicoes.map((ap) => (
          <Card 
            key={ap.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedAparicao(ap)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Calendar className="w-3 h-3" />
                    {new Date(ap.data_diario).toLocaleDateString('pt-BR')}
                  </div>
                  <p className="text-sm font-medium mt-1">{ap.numero_processo || 'Sem processo'}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-2">
                    {ap.conteudo_snippet}
                  </p>
                </div>
                <div className="flex gap-1">
                  {ap.visualizado && <Eye className="w-4 h-4 text-[var(--brand-success)]" />}
                  {ap.importante && <Star className="w-4 h-4 text-[var(--brand-warning)]" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <AparicaoModal 
        aparicao={selectedAparicao}
        open={!!selectedAparicao}
        onClose={() => setSelectedAparicao(null)}
        onUpdate={onUpdate}
      />
    </>
  );
}