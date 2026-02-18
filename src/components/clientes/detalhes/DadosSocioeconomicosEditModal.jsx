import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PROFISSOES } from '../constants/profissoes';

export default function DadosSocioeconomicosEditModal({ open, onClose, cliente, onSave }) {
  const [form, setForm] = useState({
    sexo: cliente.sexo || '',
    data_nascimento: cliente.data_nascimento || '',
    estado_civil: cliente.estado_civil || '',
    numero_dependentes: cliente.numero_dependentes || 0,
    codigo_profissao: cliente.codigo_profissao || '',
    profissao: cliente.profissao || '',
    situacao_profissional: cliente.situacao_profissional || '',
    renda_mensal_individual: cliente.renda_mensal_individual || 0,
    renda_mensal_familiar: cliente.renda_mensal_familiar || 0
  });

  const handleProfissaoChange = (codigo) => {
    const prof = PROFISSOES.find(p => p.value === codigo);
    setForm({ ...form, codigo_profissao: codigo, profissao: prof?.label || '' });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Dados Socioeconômicos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Sexo</Label>
            <RadioGroup value={form.sexo} onValueChange={(v) => setForm({...form, sexo: v})}>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="masculino" id="masc" />
                  <Label htmlFor="masc">Masculino</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="feminino" id="fem" />
                  <Label htmlFor="fem">Feminino</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="outro" id="outro" />
                  <Label htmlFor="outro">Prefiro não declarar</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Data de nascimento</Label>
              <Input type="date" value={form.data_nascimento} onChange={(e) => setForm({...form, data_nascimento: e.target.value})} />
            </div>
            <div>
              <Label>Estado civil</Label>
              <Select value={form.estado_civil} onValueChange={(v) => setForm({...form, estado_civil: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro</SelectItem>
                  <SelectItem value="casado">Casado</SelectItem>
                  <SelectItem value="divorciado">Divorciado</SelectItem>
                  <SelectItem value="viuvo">Viúvo</SelectItem>
                  <SelectItem value="uniao_estavel">União estável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nº dependentes</Label>
              <Input type="number" value={form.numero_dependentes} onChange={(e) => setForm({...form, numero_dependentes: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Profissão</Label>
              <Select value={form.codigo_profissao} onValueChange={handleProfissaoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {PROFISSOES.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Situação</Label>
              <Select value={form.situacao_profissional} onValueChange={(v) => setForm({...form, situacao_profissional: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em_atividade">Em atividade</SelectItem>
                  <SelectItem value="aposentado">Aposentado</SelectItem>
                  <SelectItem value="desempregado">Desempregado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Renda individual (R$)</Label>
              <Input type="number" step="0.01" value={form.renda_mensal_individual} onChange={(e) => setForm({...form, renda_mensal_individual: parseFloat(e.target.value) || 0})} />
            </div>
            <div>
              <Label>Renda familiar (R$)</Label>
              <Input type="number" step="0.01" value={form.renda_mensal_familiar} onChange={(e) => setForm({...form, renda_mensal_familiar: parseFloat(e.target.value) || 0})} />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}