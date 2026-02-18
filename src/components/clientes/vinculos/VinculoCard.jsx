import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function VinculoCard({ vinculo, cliente, onRemove }) {
  const navigate = useNavigate();
  
  const tipoLabels = {
    representante_legal: 'Representante Legal',
    procurador: 'Procurador',
    socio: 'Sócio',
    administrador: 'Administrador',
    preposto: 'Preposto',
    outro: 'Outro'
  };

  const handleNavigate = () => {
    if (cliente?.id) {
      navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}`);
    }
  };

  return (
    <Card className="border-[var(--border-primary)]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center shrink-0">
              {cliente?.tipo_pessoa === 'fisica' ? <User className="w-5 h-5 text-[var(--brand-primary-700)]" /> : <Building2 className="w-5 h-5 text-[var(--brand-primary-700)]" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[var(--text-primary)] truncate">{cliente?.nome_completo}</h4>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className="bg-[var(--brand-primary)] text-white">{tipoLabels[vinculo.tipo_vinculo]}</Badge>
                {vinculo.cargo && <span className="text-sm text-[var(--text-secondary)]">{vinculo.cargo}</span>}
                {vinculo.percentual_participacao && <span className="text-sm text-[var(--text-secondary)]">{vinculo.percentual_participacao}%</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNavigate}
              disabled={!cliente?.id}
              title="Ver detalhes"
            >
              <ExternalLink className="w-4 h-4 text-[var(--brand-primary)]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemove(vinculo.id)}
              title="Remover vínculo"
            >
              <Trash2 className="w-4 h-4 text-[var(--brand-error)]" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}