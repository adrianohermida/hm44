import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MultiValueInput from './MultiValueInput';

const tribunais = [
  { id: 'estadual', label: 'Estadual' },
  { id: 'federal', label: 'Federal' },
  { id: 'trabalhista', label: 'Trabalhista' },
  { id: 'eleitoral', label: 'Eleitoral' },
  { id: 'militar', label: 'Militar' },
  { id: 'tst', label: 'TST' },
  { id: 'tse', label: 'TSE' },
  { id: 'stj', label: 'STJ' },
  { id: 'stf', label: 'STF' },
  { id: 'stm', label: 'STM' }
];

export default function CNJMultiInput({ values = {}, onChange }) {
  const handleTribunalChange = (tribunal, newValues) => {
    onChange({ ...values, [tribunal]: newValues });
  };

  return (
    <div>
      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">
        Números CNJ por Tribunal
      </label>
      <Tabs defaultValue="estadual" className="w-full">
        <TabsList className="grid w-full grid-cols-5 md:grid-cols-10 gap-1">
          {tribunais.map(t => (
            <TabsTrigger key={t.id} value={t.id} className="text-xs">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tribunais.map(t => (
          <TabsContent key={t.id} value={t.id}>
            <MultiValueInput
              label=""
              values={values[t.id] || []}
              onChange={(v) => handleTribunalChange(t.id, v)}
              placeholder={`0000000-00.0000.0.00.0000`}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}