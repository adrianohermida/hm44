import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function GatilhoStats({ pendentes, aprovados, conversaoMedia }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{pendentes}</p>
              <p className="text-sm text-[var(--text-secondary)]">Pendentes</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{aprovados}</p>
              <p className="text-sm text-[var(--text-secondary)]">Aprovados</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[var(--brand-primary)]" />
            <div>
              <p className="text-2xl font-bold">{conversaoMedia}%</p>
              <p className="text-sm text-[var(--text-secondary)]">Conversão Média</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}