import React from 'react';
import { MapPin } from 'lucide-react';

export default function EnderecosExpandidos({ cliente }) {
  const enderecos = [
    { tipo: 'Principal', ...cliente.endereco },
    ...(cliente.enderecos_adicionais || [])
  ].filter(e => e.logradouro || e.cep);

  return (
    <div className="space-y-3">
      {enderecos.map((end, idx) => (
        <div key={idx} className="border-l-2 border-[var(--brand-primary)] pl-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-xs font-semibold text-[var(--brand-primary)]">
              {end.tipo || 'Endereço ' + (idx + 1)}
            </span>
          </div>
          <p className="text-sm text-[var(--text-primary)]">
            {end.logradouro}, {end.numero} {end.complemento && `- ${end.complemento}`}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {end.bairro} - {end.cidade}/{end.estado}
          </p>
          {end.cep && <p className="text-xs text-[var(--text-tertiary)]">CEP: {end.cep}</p>}
        </div>
      ))}
    </div>
  );
}