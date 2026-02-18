import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, Plus, Trash2 } from 'lucide-react';

export default function InscricoesOABPessoais({ data, onChange, disabled }) {
  const [showAddSupl, setShowAddSupl] = useState(false);
  const [newSupl, setNewSupl] = useState({ numero: '', uf: '', tipo: 'suplementar' });

  const suplementares = data.inscricoes_suplementares || [];

  const handleAddSupl = () => {
    if (!newSupl.numero || !newSupl.uf) return;
    onChange('inscricoes_suplementares', [...suplementares, newSupl]);
    setNewSupl({ numero: '', uf: '', tipo: 'suplementar' });
    setShowAddSupl(false);
  };

  const handleRemoveSupl = (index) => {
    onChange('inscricoes_suplementares', suplementares.filter((_, i) => i !== index));
  };

  const UFs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
          <Scale className="w-5 h-5" />
          Inscrições OAB (Pessoais)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">
            💡 Suas inscrições pessoais na OAB
          </p>
          <p className="text-xs text-blue-600 mt-1">
            (Diferente das inscrições da sociedade de advogados)
          </p>
        </div>

        <div>
          <Label>Tipo de Inscrição</Label>
          <Select 
            value={data.tipo_inscricao || 'definitiva'} 
            onValueChange={(v) => onChange('tipo_inscricao', v)}
            disabled={disabled}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="definitiva">Definitiva</SelectItem>
              <SelectItem value="suplementar">Suplementar</SelectItem>
              <SelectItem value="estagiario">Estagiário</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label>Número OAB Principal</Label>
            <Input
              value={data.inscricao_oab_principal || ''}
              onChange={(e) => onChange('inscricao_oab_principal', e.target.value)}
              disabled={disabled}
              placeholder="123456"
            />
          </div>
          <div>
            <Label>UF</Label>
            <Select 
              value={data.uf_oab_principal || ''} 
              onValueChange={(v) => onChange('uf_oab_principal', v)}
              disabled={disabled}
            >
              <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
              <SelectContent>
                {UFs.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Status da Inscrição</Label>
          <Select 
            value={data.status_inscricao || 'ativa'} 
            onValueChange={(v) => onChange('status_inscricao', v)}
            disabled={disabled}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="suspensa">Suspensa</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <Label>Inscrições Suplementares</Label>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowAddSupl(true)}
              disabled={disabled}
              className="hover:bg-[var(--brand-primary-50)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {showAddSupl && (
            <div className="p-3 bg-[var(--brand-primary-50)] rounded-lg border space-y-2 mb-3">
              <div className="grid grid-cols-3 gap-2">
                <Input 
                  placeholder="Número" 
                  value={newSupl.numero} 
                  onChange={(e) => setNewSupl({...newSupl, numero: e.target.value})} 
                />
                <Select value={newSupl.uf} onValueChange={(v) => setNewSupl({...newSupl, uf: v})}>
                  <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>
                    {UFs.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={newSupl.tipo} onValueChange={(v) => setNewSupl({...newSupl, tipo: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suplementar">Suplementar</SelectItem>
                    <SelectItem value="definitiva">Definitiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowAddSupl(false)}>Cancelar</Button>
                <Button size="sm" onClick={handleAddSupl} className="bg-[var(--brand-primary)]">Adicionar</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {suplementares.map((supl, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg hover:bg-[var(--brand-primary-50)]">
                <div>
                  <p className="font-medium">OAB/{supl.uf} {supl.numero}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{supl.tipo}</p>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleRemoveSupl(index)}
                  disabled={disabled}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {suplementares.length === 0 && !showAddSupl && (
              <p className="text-center text-sm text-[var(--text-secondary)] py-3">
                Nenhuma inscrição suplementar
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}