import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit2, Save, X, Plus } from 'lucide-react';

export default function ClientePropriedadesRicas({ cliente }) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    telefones: cliente?.telefones || [],
    enderecos: cliente?.enderecos || [],
    notas: cliente?.observacoes || ''
  });
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Cliente.update(cliente.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cliente-context']);
      setEditando(false);
      toast.success('Cliente atualizado');
    }
  });

  const handleSalvar = () => {
    updateMutation.mutate(formData);
  };

  const handleAddTelefone = () => {
    setFormData({
      ...formData,
      telefones: [...formData.telefones, { numero: '', tipo: 'celular' }]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Propriedades</h4>
        {!editando ? (
          <Button size="sm" variant="ghost" onClick={() => setEditando(true)}>
            <Edit2 className="w-3 h-3" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setEditando(false)}>
              <X className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleSalvar}>
              <Save className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {editando ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Telefones</Label>
              <Button size="sm" variant="ghost" onClick={handleAddTelefone}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {formData.telefones.map((tel, idx) => (
              <Input
                key={idx}
                value={tel.numero}
                onChange={(e) => {
                  const newTels = [...formData.telefones];
                  newTels[idx].numero = e.target.value;
                  setFormData({...formData, telefones: newTels});
                }}
                placeholder="(11) 99999-9999"
                className="text-sm"
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Notas Internas</Label>
            <Input
              value={formData.notas}
              onChange={(e) => setFormData({...formData, notas: e.target.value})}
              placeholder="Adicione observações..."
              className="text-sm"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-xs text-[var(--text-tertiary)]">Telefones:</span>
            {cliente?.telefones?.map((tel, idx) => (
              <p key={idx} className="text-sm">{tel.numero}</p>
            )) || <p className="text-xs text-gray-400">Nenhum</p>}
          </div>
          {cliente?.observacoes && (
            <div>
              <span className="text-xs text-[var(--text-tertiary)]">Notas:</span>
              <p className="text-sm">{cliente.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}