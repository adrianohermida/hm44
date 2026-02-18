import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import ArtigoFormModal from './ArtigoFormModal';
import ArtigoCard from './ArtigoCard';
import SettingsSkeleton from './SettingsSkeleton';

export default function BaseConhecimentoManager() {
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: artigos = [], isLoading } = useQuery({
    queryKey: ['base-conhecimento', escritorio?.id],
    queryFn: () => base44.entities.BaseConhecimento.filter({ 
      escritorio_id: escritorio.id 
    }),
    enabled: !!escritorio
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Base de Conhecimento</CardTitle>
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SettingsSkeleton count={2} />
          ) : (
            <div className="grid gap-4">
              {artigos.map(artigo => (
                <ArtigoCard
                  key={artigo.id}
                  artigo={artigo}
                  onEdit={() => { setEditando(artigo); setShowForm(true); }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <ArtigoFormModal
          artigo={editando}
          onClose={() => { setShowForm(false); setEditando(null); }}
          escritorioId={escritorio?.id}
        />
      )}
    </div>
  );
}