import React from 'react';
import { MapPin } from 'lucide-react';
import ProfileSection from './ProfileSection';
import FormField from './FormField';

export default function DadosEndereco({ formData, onChange }) {
  const handleEnderecoChange = (field, value) => {
    onChange('endereco', { ...formData.endereco, [field]: value });
  };

  const endereco = formData.endereco || {};

  return (
    <ProfileSection icon={MapPin} title="Endereço">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="CEP" name="cep" value={endereco.cep || ''} onChange={handleEnderecoChange} />
        <FormField label="Logradouro" name="logradouro" value={endereco.logradouro || ''} onChange={handleEnderecoChange} />
        <FormField label="Número" name="numero" value={endereco.numero || ''} onChange={handleEnderecoChange} />
        <FormField label="Complemento" name="complemento" value={endereco.complemento || ''} onChange={handleEnderecoChange} />
        <FormField label="Bairro" name="bairro" value={endereco.bairro || ''} onChange={handleEnderecoChange} />
        <FormField label="Cidade" name="cidade" value={endereco.cidade || ''} onChange={handleEnderecoChange} />
        <FormField label="Estado" name="estado" value={endereco.estado || ''} onChange={handleEnderecoChange} />
      </div>
    </ProfileSection>
  );
}