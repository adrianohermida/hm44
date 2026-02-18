import React from 'react';
import { Check } from 'lucide-react';

export default function CalculatorSteps({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step < currentStep
                  ? 'bg-[var(--brand-success)] text-white'
                  : step === currentStep
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step < currentStep ? <Check className="w-5 h-5" /> : step}
            </div>
            <span className="mt-2 text-xs text-[var(--brand-text-secondary)]">Etapa {step}</span>
          </div>
          {step < totalSteps && (
            <div className={`flex-1 h-1 mx-2 ${step < currentStep ? 'bg-[var(--brand-success)]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}