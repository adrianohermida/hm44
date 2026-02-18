import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, CalendarOff } from 'lucide-react';

export default function PeriodosIndisponibilidade({ config, onChange, disabled }) {
  const [showForm, setShowForm] = useState(false);
  const [newPeriodo, setNewPeriodo] = useState({ inicio: '', fim: '', motivo: '' });

  const periodos = config.periodos_indisponibilidade || [];

  const handleAdd = () => {
    if (!newPeriodo.inicio || !newPeriodo.fim) return;
    onChange({
      ...config,
      periodos_indisponibilidade: [...periodos, newPeriodo]
    });
    setNewPeriodo({ inicio: '', fim: '', motivo: '' });
    setShowForm(false);
  };

  const handleRemove = (index) => {
    onChange({
      ...config,
      periodos_indisponibilidade: periodos.filter((_, i) => i !== index)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[var(--brand-primary)]">
          <span className="flex items-center gap-2">
            <CalendarOff className="w-5 h-5" />
            Períodos de Indisponibilidade
          </span>
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            disabled={disabled}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div className="p-4 bg-[var(--brand-primary-50)] rounded-lg border space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={newPeriodo.inicio}
                  onChange={(e) => setNewPeriodo({ ...newPeriodo, inicio: e.target.value })}
                />
              </div>
              <div>
                <Label>Data Fim</Label>
                <Input
                  type="date"
                  value={newPeriodo.fim}
                  onChange={(e) => setNewPeriodo({ ...newPeriodo, fim: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Motivo</Label>
              <Input
                placeholder="Ex: Férias, Curso, Compromisso pessoal..."
                value={newPeriodo.motivo}
                onChange={(e) => setNewPeriodo({ ...newPeriodo, motivo: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleAdd} className="bg-[var(--brand-primary)]">
                Salvar
              </Button>
            </div>
          </div>
        )}

        {periodos.map((periodo, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-[var(--brand-primary-50)]"
          >
            <div>
              <p className="font-medium">
                {new Date(periodo.inicio).toLocaleDateString('pt-BR')} até{' '}
                {new Date(periodo.fim).toLocaleDateString('pt-BR')}
              </p>
              {periodo.motivo && (
                <p className="text-sm text-[var(--text-secondary)]">{periodo.motivo}</p>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemove(index)}
              disabled={disabled}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {periodos.length === 0 && !showForm && (
          <p className="text-center text-[var(--text-secondary)] py-4">
            Nenhum período de indisponibilidade cadastrado
          </p>
        )}
      </CardContent>
    </Card>
  );
}