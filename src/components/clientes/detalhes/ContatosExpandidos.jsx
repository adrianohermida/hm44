import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function ContatosExpandidos({ cliente }) {
  const emails = [cliente.email, ...(cliente.emails_adicionais || [])].filter(Boolean);
  const telefones = [
    cliente.telefone, 
    cliente.telefone_secundario, 
    ...(cliente.telefones_adicionais || [])
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      {emails.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase mb-2">E-mails</p>
          {emails.map((email, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-sm text-[var(--text-primary)]">{email}</span>
              {idx === 0 && <span className="text-xs text-[var(--brand-primary)]">(Principal)</span>}
            </div>
          ))}
        </div>
      )}
      {telefones.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase mb-2">Telefones</p>
          {telefones.map((tel, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-sm text-[var(--text-primary)]">{tel}</span>
              {idx === 0 && <span className="text-xs text-[var(--brand-primary)]">(Principal)</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}