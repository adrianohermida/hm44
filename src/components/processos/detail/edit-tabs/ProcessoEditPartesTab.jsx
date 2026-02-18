import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import ProcessoParteEditForm from '../ProcessoParteEditForm';
import ProcessoParteItem from '../ProcessoParteItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProcessoEditPartesTab({ processoId, partes, setPartes, formData }) {
  const [showForm, setShowForm] = useState(false);
  const [editingParte, setEditingParte] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const handleAddParte = (novaParte) => {
    setPartes([...partes, { ...novaParte, id: Date.now().toString() }]);
    setShowForm(false);
    toast.success('Parte adicionada');
  };

  const handleEditParte = (parte) => {
    setEditingParte(parte);
    setShowForm(true);
  };

  const handleUpdateParte = (updated) => {
    setPartes(partes.map(p => p.id === updated.id ? updated : p));
    setShowForm(false);
    setEditingParte(null);
    toast.success('Parte atualizada');
  };

  const handleDeleteParte = (parteId) => {
    if (confirm('Remover esta parte?')) {
      setPartes(partes.filter(p => p.id !== parteId));
      toast.success('Parte removida');
    }
  };

  const handleChangePolo = (parte) => {
    const polos = ['polo_ativo', 'polo_passivo', 'terceiro_interessado'];
    const currentIndex = polos.indexOf(parte.tipo_parte);
    const nextPolo = polos[(currentIndex + 1) % polos.length];
    
    setPartes(partes.map(p => 
      p.id === parte.id ? { ...p, tipo_parte: nextPolo } : p
    ));
    toast.success('Polo alterado');
  };

  const partesAtivas = partes.filter(p => p.tipo_parte === 'polo_ativo');
  const partesPassivas = partes.filter(p => p.tipo_parte === 'polo_passivo');
  const terceiroInteressados = partes.filter(p => p.tipo_parte === 'terceiro_interessado');

  // Detectar débito técnico
  const debitoTecnico = React.useMemo(() => {
    const issues = [];
    
    if (formData?.polo_ativo && partesAtivas.length === 0) {
      issues.push(`Polo ativo "${formData.polo_ativo}" não tem partes cadastradas`);
    }
    
    if (formData?.polo_passivo && partesPassivas.length === 0) {
      issues.push(`Polo passivo "${formData.polo_passivo}" não tem partes cadastradas`);
    }

    const partesSemDocumento = partes.filter(p => !p.cpf_cnpj);
    if (partesSemDocumento.length > 0) {
      issues.push(`${partesSemDocumento.length} parte(s) sem CPF/CNPJ`);
    }

    const partesSemQualificacao = partes.filter(p => !p.qualificacao);
    if (partesSemQualificacao.length > 0) {
      issues.push(`${partesSemQualificacao.length} parte(s) sem qualificação`);
    }

    return issues;
  }, [partes, formData]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--text-secondary)]">
            Gerencie as partes envolvidas no processo
          </p>
          <Badge variant="outline">{partes.length}</Badge>
          <DebitoTecnicoIndicator 
            issues={debitoTecnico} 
            isAdmin={user?.role === 'admin'} 
          />
        </div>
        <div className="flex gap-2">
          <SincronizarPartesButton 
            processo={formData}
            onComplete={() => window.location.reload()}
          />
          <Button 
            size="sm" 
            onClick={() => {
              setEditingParte(null);
              setShowForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingParte ? 'Editar Parte' : 'Nova Parte'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProcessoParteEditForm
              processoId={processoId}
              parte={editingParte}
              onSave={editingParte ? handleUpdateParte : handleAddParte}
              onCancel={() => {
                setShowForm(false);
                setEditingParte(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {/* Polo Ativo */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Polo Ativo</CardTitle>
              <Badge variant="outline">{partesAtivas.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {partesAtivas.length === 0 ? (
              <p className="text-xs text-[var(--text-tertiary)] text-center py-4">
                Nenhuma parte no polo ativo
              </p>
            ) : (
              <div className="space-y-2">
                {partesAtivas.map(parte => (
                  <ProcessoParteItem
                    key={parte.id}
                    parte={parte}
                    onEdit={handleEditParte}
                    onDelete={handleDeleteParte}
                    onChangePolo={handleChangePolo}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Polo Passivo */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Polo Passivo</CardTitle>
              <Badge variant="outline">{partesPassivas.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {partesPassivas.length === 0 ? (
              <p className="text-xs text-[var(--text-tertiary)] text-center py-4">
                Nenhuma parte no polo passivo
              </p>
            ) : (
              <div className="space-y-2">
                {partesPassivas.map(parte => (
                  <ProcessoParteItem
                    key={parte.id}
                    parte={parte}
                    onEdit={handleEditParte}
                    onDelete={handleDeleteParte}
                    onChangePolo={handleChangePolo}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terceiros Interessados */}
        {terceiroInteressados.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Terceiros Interessados</CardTitle>
                <Badge variant="outline">{terceiroInteressados.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {terceiroInteressados.map(parte => (
                  <ProcessoParteItem
                    key={parte.id}
                    parte={parte}
                    onEdit={handleEditParte}
                    onDelete={handleDeleteParte}
                    onChangePolo={handleChangePolo}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}