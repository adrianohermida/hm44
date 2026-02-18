import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ProfileCard({ user }) {
  const contactInfo = [
    { icon: Mail, label: user?.email || 'Não informado' },
    { icon: Phone, label: user?.telefone || 'Não informado' },
    { icon: MapPin, label: user?.cidade || 'Não informado' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-2xl font-bold">
          {user?.full_name?.charAt(0) || 'U'}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--brand-text-primary)]">{user?.full_name}</h3>
          <p className="text-sm text-[var(--brand-text-secondary)]">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
        </div>
      </div>
      <div className="space-y-3">
        {contactInfo.map(({ icon: Icon, label }, index) => (
          <div key={index} className="flex items-center gap-3 text-[var(--brand-text-secondary)]">
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}