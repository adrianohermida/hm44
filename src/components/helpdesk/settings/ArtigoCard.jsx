import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ArtigoCard({ artigo, onEdit }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{artigo.titulo}</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2">
              {artigo.conteudo.substring(0, 200)}...
            </p>
            <div className="flex items-center gap-2">
              {artigo.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {artigo.visivel_cliente ? (
                <Badge variant="outline" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Público
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Interno
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}