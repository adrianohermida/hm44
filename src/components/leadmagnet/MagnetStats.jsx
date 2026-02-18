import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Users, TrendingUp } from 'lucide-react';

export default function MagnetStats({ downloads, leads, conversao }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Download className="w-8 h-8 text-[var(--brand-primary)]" />
            <div>
              <p className="text-2xl font-bold">{downloads}</p>
              <p className="text-sm text-[var(--text-secondary)]">Downloads</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-[var(--brand-info)]" />
            <div>
              <p className="text-2xl font-bold">{leads}</p>
              <p className="text-sm text-[var(--text-secondary)]">Leads Capturados</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[var(--brand-success)]" />
            <div>
              <p className="text-2xl font-bold">{conversao}%</p>
              <p className="text-sm text-[var(--text-secondary)]">Taxa Conversão</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}