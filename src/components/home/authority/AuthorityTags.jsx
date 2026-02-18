import React from 'react';

export default function AuthorityTags() {
  const tags = ['#superendividamento', '#consumidor', '#lei14181'];
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] px-3 py-1 rounded-full text-sm">
          {tag}
        </span>
      ))}
    </div>
  );
}