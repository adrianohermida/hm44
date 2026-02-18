import React from 'react';
import { Quote, BookOpen } from 'lucide-react';

export default function MediaHighlight() {
  return (
    <div className="bg-[var(--brand-primary)] rounded-2xl p-8 text-[var(--text-on-primary)] relative overflow-hidden">
      <BookOpen className="absolute top-4 right-4 w-16 h-16 opacity-10" />
      <div className="relative z-10">
        <p className="text-xl font-semibold mb-4 leading-relaxed">
          "Autor do Manual do Superendividamento, obra pioneira no Brasil para auxiliar consumidores na recuperação financeira"
        </p>
        <div className="flex items-center gap-4">
          <Quote className="w-6 h-6" />
          <span className="text-sm opacity-90">Obra Educacional e Jurídica</span>
        </div>
      </div>
    </div>
  );
}