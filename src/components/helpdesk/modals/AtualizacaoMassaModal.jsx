import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function AtualizacaoMassaModal({ 
  open, 
  onClose, 
  selectedCount,
  escritorioId,
  onConfirm,
  isLoading 
}) {
  const [updates, setUpdates] = useState({
    status: '',
    prioridade: '',
    departamento_id: '',
    responsavel_email: ''
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos', escritorioId],
    queryFn: () => base44.entities.Departamento.filter({ 
      escritorio_id: escritorioId,
      ativo: true 
    }),
    enabled: !!escritorioId
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users-team'],
    queryFn: () => base44.entities.User.filter({ role: 'admin' })
  });

  const handleAtualizar = () => {
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== '')
    );
    
    if (Object.keys(fieldsToUpdate).length === 0) {
      return;
    }
    
    onConfirm(fieldsToUpdate);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atualização em massa</DialogTitle>
          <p className="text-sm text-[var(--text-secondary)]">
            Atualizar {selectedCount} ticket(s) selecionado(s)
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={updates.status} onValueChange={(v) => setUpdates({...updates, status: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Não alterar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                <SelectItem value="aguardando_cliente">Aguardando Cliente</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Select value={updates.prioridade} onValueChange={(v) => setUpdates({...updates, prioridade: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Não alterar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Departamento</Label>
            <Select value={updates.departamento_id} onValueChange={(v) => setUpdates({...updates, departamento_id: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Não alterar" />
              </SelectTrigger>
              <SelectContent>
                {departamentos.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Agente Responsável</Label>
            <Select value={updates.responsavel_email} onValueChange={(v) => setUpdates({...updates, responsavel_email: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Não alterar" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.email} value={user.email}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAtualizar} 
            disabled={isLoading || Object.values(updates).every(v => !v)}
            className="bg-[var(--brand-primary)]"
          >
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}