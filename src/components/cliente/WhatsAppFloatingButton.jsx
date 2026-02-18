import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, ExternalLink } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const [open, setOpen] = useState(false);
  const whatsappUrl = base44.agents.getWhatsAppConnectURL('assistente_virtual');

  return (
    <div className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white border border-green-200 rounded-2xl shadow-2xl p-4 w-64 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-bold text-green-900">Assistente Virtual</p>
          </div>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            Fale com nosso assistente via WhatsApp para agendar consultas, acompanhar processos e tirar dúvidas jurídicas.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Abrir no WhatsApp
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
        aria-label="Assistente WhatsApp"
      >
        {open
          ? <X className="w-6 h-6" />
          : <MessageCircle className="w-6 h-6" />
        }
      </button>
    </div>
  );
}