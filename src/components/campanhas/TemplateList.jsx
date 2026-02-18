import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Edit, Trash2 } from 'lucide-react';

export default function TemplateList({ templates, onSelect, onDelete }) {
  return (
    <div className="space-y-3">
      {templates.map(template => (
        <Card key={template.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
              <div>
                <h4 className="font-semibold text-[var(--text-primary)]">{template.nome}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{template.assunto}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onSelect(template)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(template.id)}>
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}