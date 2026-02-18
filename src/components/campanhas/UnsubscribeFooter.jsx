import React from 'react';

export default function UnsubscribeFooter({ unsubscribeToken }) {
  const unsubscribeUrl = `${window.location.origin}/unsubscribe?token=${unsubscribeToken}`;
  
  const footerHtml = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
      <p style="margin-bottom: 8px;">Você está recebendo este email porque se cadastrou em nosso escritório.</p>
      <p style="margin-bottom: 8px;">
        <a href="${unsubscribeUrl}" style="color: #10b981; text-decoration: none;">Cancelar inscrição</a>
      </p>
      <p style="margin-bottom: 0;">Conforme Lei Geral de Proteção de Dados (LGPD) - Lei 13.709/2018</p>
    </div>
  `;

  return (
    <div className="mt-4 p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)]">
      <p className="text-xs text-[var(--text-secondary)] mb-2 font-semibold">Footer LGPD (será adicionado automaticamente):</p>
      <div 
        className="text-xs text-[var(--text-tertiary)]"
        dangerouslySetInnerHTML={{ __html: footerHtml }}
      />
    </div>
  );
}