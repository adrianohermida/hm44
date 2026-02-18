import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialCardOptimized({ name, text, rating, photo }) {
  return (
    <div className="bg-[var(--bg-elevated)] p-8 rounded-2xl border border-[var(--bg-tertiary)] hover:border-[var(--brand-primary)] hover:shadow-xl transition-all duration-300 relative">
      <Quote className="w-10 h-10 text-[var(--brand-primary-200)] absolute top-4 right-4" />
      <div className="flex items-center gap-4 mb-4">
        <img src={photo} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-[var(--brand-primary)]" />
        <div>
          <p className="font-bold text-[var(--text-primary)]">{name}</p>
          <div className="flex gap-1 mt-1">
            {[...Array(rating)].map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-[var(--brand-warning)] text-[var(--brand-warning)]" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[var(--text-secondary)] italic leading-relaxed">"{text}"</p>
    </div>
  );
}