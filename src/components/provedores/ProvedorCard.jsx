import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Eye } from 'lucide-react';
import CardHeaderActions from '@/components/ui/CardHeaderActions';
import ProvedorCardHeader from './cards/ProvedorCardHeader';
import ProvedorCardContent from './cards/ProvedorCardContent';
import ProvedorActions from './ProvedorActions';
import HealthBadge from '@/components/conectores/health/HealthBadge';

const ProvedorCard = React.memo(({ provedor, onEdit, onViewDetails }) => {
  return (
    <Card className="min-h-[180px] flex flex-col transition-all hover:shadow-lg hover:border-[var(--brand-primary-200)] group">
      <CardHeaderActions title="">
        <div className="flex items-center gap-2 sm:gap-3">
          <ProvedorCardHeader provedor={provedor} />
          <HealthBadge status={provedor.saude_status} />
        </div>
        <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          {onViewDetails && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(provedor)} 
              aria-label="Ver detalhes"
              className="min-h-[44px] min-w-[44px] transition-all hover:scale-105"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(provedor)} 
            aria-label="Editar provedor"
            className="min-h-[44px] min-w-[44px] transition-all hover:scale-105"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </CardHeaderActions>
      <CardContent className="flex-1">
        <ProvedorCardContent provedor={provedor} />
        <ProvedorActions provedorId={provedor.id} />
      </CardContent>
    </Card>
  );
});

ProvedorCard.displayName = 'ProvedorCard';

export default ProvedorCard;