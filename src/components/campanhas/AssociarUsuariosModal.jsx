import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';

export default function AssociarUsuariosModal({ onConfirm, isLoading }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            Associar Usuários ao Escritório
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Esta ação irá associar todos os usuários cadastrados ao escritório atual, 
            garantindo que eles recebam as campanhas de email.
          </p>
        </div>
      </div>
      <Button 
        onClick={onConfirm} 
        disabled={isLoading}
        className="w-full bg-[var(--brand-primary)]"
      >
        <Users className="w-4 h-4 mr-2" />
        {isLoading ? 'Processando...' : 'Confirmar Associação'}
      </Button>
    </Card>
  );
}