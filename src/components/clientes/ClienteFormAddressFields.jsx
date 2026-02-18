import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import CEPInput from './CEPInput';

export default function ClienteFormAddressFields({ form, setForm }) {
  const [loadingCEP, setLoadingCEP] = useState(false);

  const updateEndereco = (field, value) => {
    setForm({ ...form, endereco: { ...form.endereco, [field]: value } });
  };

  const consultarCEP = async () => {
    if (!form.endereco?.cep || form.endereco.cep.replace(/\D/g, '').length !== 8) {
      toast.error('CEP inválido');
      return;
    }

    setLoadingCEP(true);
    try {
      const { data: result } = await base44.functions.invoke('consultarCEP', { cep: form.endereco.cep });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setForm(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          logradouro: result.logradouro || prev.endereco.logradouro,
          bairro: result.bairro || prev.endereco.bairro,
          cidade: result.localidade || prev.endereco.cidade,
          estado: result.uf || prev.endereco.estado
        }
      }));
      toast.success('Endereço preenchido automaticamente');
    } catch (error) {
      toast.error('Erro ao consultar CEP');
    } finally {
      setLoadingCEP(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-[var(--border-primary)]">
      <h3 className="font-semibold text-[var(--text-primary)]">Endereço</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>CEP</Label>
          <CEPInput
            value={form.endereco?.cep || ''}
            onChange={(value) => updateEndereco('cep', value)}
            onConsultar={consultarCEP}
            loading={loadingCEP}
          />
        </div>
        <div>
          <Label>Logradouro</Label>
          <Input
            value={form.endereco?.logradouro || ''}
            onChange={(e) => updateEndereco('logradouro', e.target.value)}
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Número</Label>
          <Input
            value={form.endereco?.numero || ''}
            onChange={(e) => updateEndereco('numero', e.target.value)}
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </div>
        <div className="col-span-2">
          <Label>Bairro</Label>
          <Input
            value={form.endereco?.bairro || ''}
            onChange={(e) => updateEndereco('bairro', e.target.value)}
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Cidade</Label>
          <Input
            value={form.endereco?.cidade || ''}
            onChange={(e) => updateEndereco('cidade', e.target.value)}
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </div>
        <div>
          <Label>Estado</Label>
          <Input
            value={form.endereco?.estado || ''}
            onChange={(e) => updateEndereco('estado', e.target.value)}
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </div>
      </div>
    </div>
  );
}