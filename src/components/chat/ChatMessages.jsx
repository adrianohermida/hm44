import React from 'react';
import { MessageCircle, Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessages({ messages, messagesEndRef }) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[var(--brand-primary-100)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Scale className="w-8 h-8 text-[var(--brand-primary)]" />
        </div>
        <p className="font-semibold text-[var(--text-primary)] mb-1">Olá! Sou o assistente do Dr. Adriano</p>
        <p className="text-sm text-[var(--text-secondary)]">Como posso ajudar com suas dívidas hoje?</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {msg.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0">
              <Scale className="w-4 h-4 text-[var(--text-on-primary)]" />
            </div>
          )}
          <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
            msg.role === "user" ? "bg-[var(--brand-primary)] text-[var(--text-on-primary)]" : "bg-[var(--bg-elevated)] border border-[var(--border-primary)]"
          }`}>
            {msg.role === "user" ? (
              <p className="text-sm">{msg.content}</p>
            ) : (
              <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {msg.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}