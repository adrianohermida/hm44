import React from 'react';
import { Briefcase } from 'lucide-react';

export default function ProfessionalInfoForm({ formData, onInputChange }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="w-5 h-5 text-[var(--brand-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--brand-text-primary)]">
          Informações Profissionais
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--brand-text-primary)] mb-2">
            Cargo
          </label>
          <input
            type="text"
            value={formData.job_title || ''}
            onChange={(e) => onInputChange('job_title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--brand-text-primary)] mb-2">
            Empresa
          </label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) => onInputChange('company', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--brand-text-primary)] mb-2">
            Anos de Experiência
          </label>
          <input
            type="number"
            value={formData.experience_years || ''}
            onChange={(e) => onInputChange('experience_years', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
        </div>
      </div>
    </div>
  );
}