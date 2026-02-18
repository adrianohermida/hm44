import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Trash2 } from 'lucide-react';

export default function CertificadoCard({ cert, onDelete }) {
  const isValid = new Date(cert.data_validade) > new Date();
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[var(--brand-primary)]" />
            <div>
              <p className="font-semibold">{cert.nome}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={isValid ? 'default' : 'destructive'}>
                  {isValid ? 'Válido' : 'Expirado'}
                </Badge>
                <Badge variant="outline">{cert.tipo}</Badge>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-2">
                Validade: {new Date(cert.data_validade).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onDelete(cert.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}