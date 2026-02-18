import React from 'react';
import { Check } from 'lucide-react';

export default function CalculatorProgress({ currentStep, totalSteps }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
                    isCompleted
                      ? 'bg-[var(--brand-primary)] text-white'
                      : isCurrent
                      ? 'bg-[var(--brand-primary)] text-white ring-4 ring-[var(--brand-primary-200)]'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-2 border-[var(--border-primary)]'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : stepNumber}
                </div>
                <span className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 hidden sm:block">
                  Passo {stepNumber}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    isCompleted ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}