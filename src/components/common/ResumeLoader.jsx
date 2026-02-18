import React from 'react';
import { Scale, FileText, Gavel } from 'lucide-react';

export default function ResumeLoader() {
  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-[var(--brand-primary)] rounded-full mx-auto flex items-center justify-center animate-pulse">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--brand-primary-200)] rounded-full flex items-center justify-center animate-bounce">
            <FileText className="w-4 h-4 text-[var(--brand-primary-700)]" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-[var(--brand-primary-200)] rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.3s' }}>
            <Gavel className="w-4 h-4 text-[var(--brand-primary-700)]" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">Carregando...</h3>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-[var(--text-secondary)]">Preparando sua defesa jurídica...</p>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}