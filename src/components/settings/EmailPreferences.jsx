import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function EmailPreferences({ userEmail, escritorioId }) {
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const data = await base44.entities.EmailPreferencia.filter({ email: userEmail });
    if (data.length > 0) {
      setPrefs(data[0]);
    } else {
      const newPref = await base44.entities.EmailPreferencia.create({
        email: userEmail,
        escritorio_id: escritorioId,
        unsubscribe_token: crypto.randomUUID(),
        data_consentimento: new Date().toISOString()
      });
      setPrefs(newPref);
    }
  };

  const updatePref = async (field, value) => {
    await base44.entities.EmailPreferencia.update(prefs.id, { [field]: value });
    setPrefs({...prefs, [field]: value});
    toast.success('Preferências atualizadas');
  };

  if (!prefs) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Preferências de Email</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--text-primary)]">Emails Marketing</p>
            <p className="text-sm text-[var(--text-secondary)]">Receber ofertas e novidades</p>
          </div>
          <Switch checked={prefs.aceita_marketing} onCheckedChange={(v) => updatePref('aceita_marketing', v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--text-primary)]">Newsletter</p>
            <p className="text-sm text-[var(--text-secondary)]">Boletins informativos</p>
          </div>
          <Switch checked={prefs.aceita_newsletter} onCheckedChange={(v) => updatePref('aceita_newsletter', v)} />
        </div>
      </div>
    </Card>
  );
}