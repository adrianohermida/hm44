import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

const ProntuarioItemCard = ({ prontuario, onView }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
          <div>
            <h3 className="font-semibold text-sm">consulta</h3>
            <p className="text-xs text-[var(--text-tertiary)]">
              {format(new Date(prontuario.created_date), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => onView(prontuario)}>
          <Eye className="w-4 h-4" />
        </Button>
      </div>
      {prontuario.medico && (
        <p className="text-xs text-[var(--text-secondary)] mb-2">
          <strong>Médico:</strong> {prontuario.medico}
        </p>
      )}
      {prontuario.queixa && (
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
          <strong>Queixa:</strong> {prontuario.queixa}
        </p>
      )}
    </CardContent>
  </Card>
);

export default function HistoricoClinicoTab({ clienteId, escritorioId }) {
  const { data: prontuarios = [], isLoading } = useQuery({
    queryKey: ['prontuarios', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Consulta.filter({
        cliente_id: clienteId,
        escritorio_id: escritorioId
      }, '-created_date');
      return data;
    },
    enabled: !!clienteId && !!escritorioId
  });

  const handleView = (prontuario) => {
    console.log('Ver prontuário:', prontuario);
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (prontuarios.length === 0) {
    return (
      <Card className="bg-white dark:bg-[var(--bg-elevated)]">
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum prontuário</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Clique em "Novo Prontuário" para adicionar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {prontuarios.map(prontuario => (
        <ProntuarioItemCard
          key={prontuario.id}
          prontuario={prontuario}
          onView={handleView}
        />
      ))}
    </div>
  );
}