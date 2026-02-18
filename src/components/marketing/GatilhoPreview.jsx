import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, MessageCircle, TrendingUp, Users, Award } from 'lucide-react';

export default function GatilhoPreview({ gatilho }) {
  if (!gatilho) return null;

  if (gatilho.tipo_conteudo === 'hero') {
    return (
      <Card className="bg-gradient-to-br from-[#0a0e1a] to-[#1a2332] text-white">
        <CardHeader>
          <CardTitle className="text-sm text-gray-400">Preview: Hero Home</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gatilho.badge_texto && (
            <div className="inline-flex items-center gap-2 bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
              <span className="text-xs">{gatilho.badge_texto}</span>
            </div>
          )}

          <h1 className="text-3xl font-extrabold leading-tight">
            {gatilho.headline_primaria}
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            {gatilho.headline_secundaria}
          </p>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[var(--brand-primary)] rounded-lg text-sm font-semibold flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              {gatilho.cta_primario_texto}
            </button>
            <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-semibold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {gatilho.cta_secundario_texto}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4">
            {[
              { icon: TrendingUp, value: gatilho.estatistica_1_valor, label: gatilho.estatistica_1_label, visivel: gatilho.estatistica_1_visivel },
              { icon: Users, value: gatilho.estatistica_2_valor, label: gatilho.estatistica_2_label, visivel: gatilho.estatistica_2_visivel },
              { icon: Award, value: gatilho.estatistica_3_valor, label: gatilho.estatistica_3_label, visivel: gatilho.estatistica_3_visivel },
              { icon: Award, value: gatilho.estatistica_4_valor, label: gatilho.estatistica_4_label, visivel: gatilho.estatistica_4_visivel }
            ].filter(s => s.visivel && s.value).map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
                <stat.icon className="w-4 h-4 text-[var(--brand-primary)] mb-1" />
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-gray-500">Preview: {gatilho.tipo_conteudo}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Preview não disponível para este tipo</p>
      </CardContent>
    </Card>
  );
}