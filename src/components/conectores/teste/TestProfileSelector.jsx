import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function TestProfileSelector({ 
  profiles, 
  selected, 
  onSelect, 
  onNew, 
  onEdit, 
  onDelete,
  hasUnsavedParams = false
}) {
  const selectedProfile = profiles.find(p => p.id === selected);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select value={selected} onValueChange={onSelect}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione um perfil de teste" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map(p => (
              <SelectItem key={p.id} value={p.id}>
                <div className="flex items-center gap-2">
                  {p.nome}
                  {p.provedor_id && !p.endpoint_id ? (
                    <Badge variant="outline" className="text-xs">Provedor</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Endpoint</Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onNew} title="Salvar parâmetros como perfil">
          <Plus className="w-4 h-4" />
        </Button>
        {selectedProfile && (
          <>
            <Button variant="outline" size="sm" onClick={() => onEdit(selectedProfile)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(selectedProfile)}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </>
        )}
      </div>
      
      {hasUnsavedParams && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 px-3 py-2 rounded-md border border-amber-200 dark:border-amber-800">
          <Plus className="w-3 h-3" />
          <span>
            Parâmetros preenchidos. Clique no "+" para salvar como perfil reutilizável.
          </span>
        </div>
      )}
      
      {selectedProfile && (
        <div className="text-xs text-[var(--text-tertiary)] space-y-1 px-1">
          {selectedProfile.descricao && (
            <div>{selectedProfile.descricao}</div>
          )}
          <div className="flex items-center gap-3">
            <span>
              Escopo: {selectedProfile.endpoint_id ? '🎯 Endpoint' : '📦 Provedor'}
            </span>
            {selectedProfile.vezes_utilizado > 0 && (
              <span>
                Usado: {selectedProfile.vezes_utilizado}x
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}