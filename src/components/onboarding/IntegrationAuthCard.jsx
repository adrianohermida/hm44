import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function IntegrationAuthCard({ icon: Icon, title, description, authorized, onAuthorize, loading }) {
  return (
    <Card className={authorized ? 'border-[var(--brand-success)]' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[var(--brand-primary)]" aria-hidden="true" />
          {title}
          {authorized && <Check className="w-5 h-5 text-[var(--brand-success)] ml-auto" aria-hidden="true" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--text-secondary)] mb-4">{description}</p>
        {!authorized && (
          <Button onClick={onAuthorize} disabled={loading} className="w-full">
            {loading ? 'Conectando...' : 'Conectar'}
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}