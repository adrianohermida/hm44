import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ClienteFormBasicFields({ form, setForm, tipoPessoa }) {
  return (
    <>
      <div>
        <Label>Nome Completo {tipoPessoa === 'juridica' && '(Razão Social)'}</Label>
        <Input
          required
          value={form.nome_completo}
          onChange={(e) => setForm({ ...form, nome_completo: e.target.value })}
          className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
        />
      </div>
      {tipoPessoa === 'fisica' ? (
        <>
          <div>
            <Label>RG</Label>
            <Input
              value={form.rg}
              onChange={(e) => setForm({ ...form, rg: e.target.value })}
              className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Nascimento</Label>
              <Input
                type="date"
                value={form.data_nascimento}
                onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
                className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
              />
            </div>
            <div>
              <Label>Estado Civil</Label>
              <Select value={form.estado_civil} onValueChange={(v) => setForm({ ...form, estado_civil: v })}>
                <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  <SelectItem value="uniao_estavel">União Estável</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      ) : null}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>E-mail</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </div>
      </div>
    </>
  );
}