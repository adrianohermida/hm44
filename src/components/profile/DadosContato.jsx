import React from 'react';
import { Phone } from 'lucide-react';
import ProfileSection from './ProfileSection';
import FormField from './FormField';

export default function DadosContato({ formData, onChange }) {
  return (
    <ProfileSection icon={Phone} title="Dados de Contato">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="E-mail" name="email" value={formData.email} onChange={onChange} type="email" required />
        <FormField label="Telefone" name="telefone" value={formData.telefone || ''} onChange={onChange} />
        <FormField label="WhatsApp" name="whatsapp" value={formData.whatsapp || ''} onChange={onChange} />
      </div>
    </ProfileSection>
  );
}