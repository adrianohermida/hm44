import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';

export default function GatilhoStatsToggles({ formData, onChange }) {
  const stats = [
    { key: 1, label: 'Target 1', valorKey: 'estatistica_1_valor', labelKey: 'estatistica_1_label', visivelKey: 'estatistica_1_visivel' },
    { key: 2, label: 'Target 2', valorKey: 'estatistica_2_valor', labelKey: 'estatistica_2_label', visivelKey: 'estatistica_2_visivel' },
    { key: 3, label: 'Target 3', valorKey: 'estatistica_3_valor', labelKey: 'estatistica_3_label', visivelKey: 'estatistica_3_visivel' },
    { key: 4, label: 'Target 4', valorKey: 'estatistica_4_valor', labelKey: 'estatistica_4_label', visivelKey: 'estatistica_4_visivel' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Estatísticas (Targets)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.key} className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">{stat.label}</span>
              <div className="flex items-center gap-2">
                {formData[stat.visivelKey] ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <Switch
                  checked={formData[stat.visivelKey]}
                  onCheckedChange={(checked) => onChange(stat.visivelKey, checked)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={formData[stat.valorKey] || ''}
                onChange={(e) => onChange(stat.valorKey, e.target.value)}
                placeholder="Valor"
                className="text-xs px-2 py-1 border rounded"
              />
              <input
                type="text"
                value={formData[stat.labelKey] || ''}
                onChange={(e) => onChange(stat.labelKey, e.target.value)}
                placeholder="Label"
                className="text-xs px-2 py-1 border rounded"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}