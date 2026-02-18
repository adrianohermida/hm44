import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function GuestBanner() {
  return (
    <Card className="border-l-4 border-l-[var(--brand-warning)] bg-yellow-50 mb-4">
      <CardContent className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs md:text-sm text-[var(--text-primary)]">
          <strong>🔓 Simulação Gratuita:</strong> Dados salvos apenas nesta sessão.
        </p>
        <Button 
          size="sm" 
          onClick={() => base44.auth.redirectToLogin()} 
          className="bg-[var(--brand-primary)] shrink-0 w-full sm:w-auto"
        >
          Criar Conta
        </Button>
      </CardContent>
    </Card>
  );
}