import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Type, Image, Link, Layout } from 'lucide-react';

export default function VisualBuilder({ onInsert }) {
  const elements = [
    { id: 'header', label: 'Cabeçalho', icon: Layout, html: '<h1 style="color: #10b981; font-size: 24px; margin-bottom: 16px;">Título</h1>' },
    { id: 'paragraph', label: 'Parágrafo', icon: Type, html: '<p style="color: #374151; line-height: 1.6; margin-bottom: 12px;">Seu texto aqui...</p>' },
    { id: 'button', label: 'Botão', icon: Link, html: '<a href="#" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Clique Aqui</a>' },
    { id: 'image', label: 'Imagem', icon: Image, html: '<img src="https://via.placeholder.com/600x300" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Elementos Visuais</h3>
      <div className="grid grid-cols-2 gap-3">
        {elements.map(el => (
          <Button 
            key={el.id}
            variant="outline" 
            onClick={() => onInsert(el.html)}
            className="h-20 flex-col gap-2"
          >
            <el.icon className="w-5 h-5" />
            <span className="text-xs">{el.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}