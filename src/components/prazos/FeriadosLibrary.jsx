import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import FeriadoForm from './FeriadoForm';

export default function FeriadosLibrary({ escritorio_id }) {
  const [showForm, setShowForm] = useState(false);
  const [editingFeriado, setEditingFeriado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: feriados = [], isLoading } = useQuery({
    queryKey: ['feriados'],
    queryFn: () => base44.entities.Feriado.filter({ escritorio_id }),
    enabled: !!escritorio_id,
    initialData: []
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Feriado.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['feriados']);
      toast.success('Feriado excluído');
    }
  });

  const filteredFeriados = feriados.filter(f =>
    f.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Buscar feriados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Feriado
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Carregando...</div>
      ) : filteredFeriados.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Nenhum feriado cadastrado</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Criar primeiro feriado
          </Button>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredFeriados.map(feriado => (
            <Card key={feriado.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{feriado.descricao}</p>
                    <p className="text-sm text-slate-600">
                      {feriado.data} - {feriado.tipo} - {feriado.abrangencia}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => { setEditingFeriado(feriado); setShowForm(true); }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteMutation.mutate(feriado.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <FeriadoForm
          feriado={editingFeriado}
          escritorio_id={escritorio_id}
          onClose={() => { setShowForm(false); setEditingFeriado(null); }}
        />
      )}
    </>
  );
}