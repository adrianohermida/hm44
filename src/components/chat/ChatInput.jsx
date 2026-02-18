import React from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ value, onChange, onSubmit, disabled }) {
  return (
    <form onSubmit={onSubmit} className="p-4 bg-[var(--bg-primary)] border-t border-[var(--border-primary)]">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={onChange}
          placeholder="Digite sua pergunta jurídica..."
          className="flex-1 border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-[var(--text-on-primary)] p-2 rounded-lg disabled:opacity-50 transition-colors"
          aria-label="Enviar mensagem"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}