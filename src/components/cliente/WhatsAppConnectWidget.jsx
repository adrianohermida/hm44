import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, ExternalLink, X } from 'lucide-react';

export default function WhatsAppConnectWidget({ user }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const whatsappUrl = base44.agents.getWhatsAppConnectURL('assistente_virtual');

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-green-500 p-2.5 rounded-xl flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-900">
                Assistente no WhatsApp
              </p>
              <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
                Consulte seu processo, agende consultas e tire dúvidas direto pelo WhatsApp.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Conectar WhatsApp
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-green-500 hover:text-green-700 flex-shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}