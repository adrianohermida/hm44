import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogCard({ title, date, img, category, excerpt }) {
  return (
    <article className="group bg-[var(--navy-800)] rounded-xl overflow-hidden border border-transparent hover:border-[var(--brand-primary)] transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img src={img} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        {category && (
          <span className="absolute top-3 left-3 bg-[var(--brand-primary)] text-white px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <h3 className="font-bold text-white mb-3 text-lg group-hover:text-[var(--brand-primary)] transition-colors">
          {title}
        </h3>
        {excerpt && <p className="text-gray-400 text-sm mb-4">{excerpt}</p>}
        <button className="text-[var(--brand-primary)] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
          Ler mais <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}