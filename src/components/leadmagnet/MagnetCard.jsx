import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Edit } from 'lucide-react';

export default function MagnetCard({ magnet, onDownload, onEdit }) {
  const icons = { ebook: FileText, calculadora: Download };
  const Icon = icons[magnet.tipo] || FileText;

  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {magnet.capa_url && (
          <img src={magnet.capa_url} alt={magnet.titulo} className="w-full h-48 object-cover rounded mb-4" />
        )}
        <div className="flex items-start gap-3 mb-3">
          <Icon className="w-6 h-6 text-[var(--brand-primary)]" />
          <div className="flex-1">
            <h3 className="font-bold text-[var(--text-primary)] mb-1">{magnet.titulo}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{magnet.subtitulo}</p>
          </div>
        </div>
        {magnet.valor_percebido && magnet.exibir_valor !== false && (
          <p className="text-xs text-[var(--text-tertiary)] mb-3">Valor: {magnet.valor_percebido}</p>
        )}
        <div className="flex gap-2">
          <Button onClick={() => onDownload(magnet)} className="flex-1 bg-[var(--brand-primary)]">
            <Download className="w-4 h-4 mr-2" />Baixar Grátis
          </Button>
          {onEdit && (
            <Button onClick={() => onEdit(magnet)} variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}