import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import DepartamentoFormModal from './DepartamentoFormModal';
import DepartamentoCard from './DepartamentoCard';
import SettingsSkeleton from './SettingsSkeleton';

export default function DepartamentosManager() {
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: departamentos = [], isLoading } = useQuery({
    queryKey: ['departamentos', escritorio?.id],
    queryFn: () => base44.entities.Departamento.filter({ 
      escritorio_id: escritorio.id 
    }),
    enabled: !!escritorio
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Departamentos</CardTitle>
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Departamento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SettingsSkeleton count={2} />
          ) : (
            <div className="grid gap-4">
              {departamentos.map(dept => (
                <DepartamentoCard
                  key={dept.id}
                  departamento={dept}
                  onEdit={() => { setEditando(dept); setShowForm(true); }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <DepartamentoFormModal
          departamento={editando}
          onClose={() => { setShowForm(false); setEditando(null); }}
          escritorioId={escritorio?.id}
        />
      )}
    </div>
  );
}