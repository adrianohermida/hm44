import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function EmailHeadersModal({ open, onClose, mensagem, emailStatus }) {
  if (!mensagem) return null;

  const headers = [
    { label: 'Message-ID', value: emailStatus?.sendgrid_message_id || 'N/A' },
    { label: 'From', value: mensagem.remetente_email },
    { label: 'To', value: mensagem.ticket?.cliente_email || 'N/A' },
    { label: 'Subject', value: mensagem.ticket?.titulo || 'N/A' },
    { label: 'Date', value: new Date(mensagem.created_date).toUTCString() },
    { label: 'Content-Type', value: 'text/html; charset=UTF-8' },
    { label: 'Thread-ID', value: mensagem.ticket?.email_thread_id || 'N/A' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cabeçalhos do Email</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="text-xs font-semibold text-blue-700 mb-2">Status de Entrega</div>
              {emailStatus ? (
                <div className="space-y-1 text-xs">
                  <div><strong>Status:</strong> <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{emailStatus.status}</span></div>
                  {emailStatus.timestamp_envio && (
                    <div><strong>Enviado:</strong> {new Date(emailStatus.timestamp_envio).toLocaleString('pt-BR')}</div>
                  )}
                  {emailStatus.timestamp_entrega && (
                    <div><strong>Entregue:</strong> {new Date(emailStatus.timestamp_entrega).toLocaleString('pt-BR')}</div>
                  )}
                  {emailStatus.timestamp_abertura && (
                    <div><strong>Aberto:</strong> {new Date(emailStatus.timestamp_abertura).toLocaleString('pt-BR')}</div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Sem informações de status</p>
              )}
            </div>

            <div className="bg-gray-50 border rounded p-3">
              <div className="text-xs font-semibold text-gray-700 mb-2">Headers Completos</div>
              <div className="space-y-2">
                {headers.map((header, idx) => (
                  <div key={idx} className="text-xs font-mono">
                    <span className="text-blue-600 font-semibold">{header.label}:</span>
                    <span className="text-gray-700 ml-2">{header.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {emailStatus?.eventos && emailStatus.eventos.length > 0 && (
              <div className="bg-gray-50 border rounded p-3">
                <div className="text-xs font-semibold text-gray-700 mb-2">Eventos SendGrid</div>
                <div className="space-y-2">
                  {emailStatus.eventos.map((evento, idx) => (
                    <div key={idx} className="text-xs bg-white p-2 rounded border">
                      <div><strong>Evento:</strong> {evento.event}</div>
                      <div><strong>Timestamp:</strong> {new Date(evento.timestamp * 1000).toLocaleString('pt-BR')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}