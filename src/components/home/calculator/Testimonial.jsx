import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonial({ name, text, rating = 5, avatar }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Quote className="w-8 h-8 text-[var(--brand-primary)] opacity-20 mb-4" />
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-[var(--brand-text-secondary)] mb-4 italic">"{text}"</p>
      <div className="flex items-center gap-3">
        {avatar && <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />}
        <p className="font-semibold text-[var(--brand-text-primary)]">{name}</p>
      </div>
    </div>
  );
}