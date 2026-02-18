import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-[var(--text-on-primary)] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-40 transition-all hover:scale-110"
      aria-label="Abrir chat com Dr. Adriano"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}