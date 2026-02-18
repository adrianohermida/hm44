import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import TemplateFormModal from './TemplateFormModal';
import TemplateCard from './TemplateCard';
import SettingsSkeleton from './SettingsSkeleton';
import VariaveisDisponiveis from './VariaveisDisponiveis';
import ImportarTemplatesCSV from './ImportarTemplatesCSV';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function TemplatesManager() {
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates-resposta', escritorio?.id],
    queryFn: () => base44.entities.TemplateResposta.filter({ 
      escritorio_id: escritorio.id 
    }, '-vezes_usado'),
    enabled: !!escritorio
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Templates de Resposta</CardTitle>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {templates.length} template{templates.length !== 1 ? 's' : ''} cadastrado{templates.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setImportOpen(true)} size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar CSV
                </Button>
                <Button onClick={() => setShowForm(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Template
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SettingsSkeleton count={2} />
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                Nenhum template criado ainda
              </div>
            ) : (
              <div className="grid gap-4">
                {templates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={() => { setEditando(template); setShowForm(true); }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <VariaveisDisponiveis />
      </div>

      {showForm && (
        <TemplateFormModal
          template={editando}
          onClose={() => { setShowForm(false); setEditando(null); }}
          escritorioId={escritorio?.id}
        />
      )}

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-2xl">
          <ImportarTemplatesCSV
            escritorioId={escritorio?.id}
            onClose={() => setImportOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}