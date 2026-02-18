import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Hash } from 'lucide-react';

export default function TemplateCard({ template, onEdit }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{template.nome}</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-2">{template.assunto}</p>
            <div className="text-xs text-[var(--text-tertiary)] line-clamp-2">
              {template.corpo.substring(0, 150)}...
            </div>
            {template.atalho && (
              <div className="flex items-center gap-1 mt-2 text-xs text-[var(--brand-primary)]">
                <Hash className="w-3 h-3" />
                {template.atalho}
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}