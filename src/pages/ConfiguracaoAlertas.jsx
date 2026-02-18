import React from 'react';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModuloNav from '@/components/conectores/ModuloNav';
import AlertasEmailConfig from '@/components/conectores/alertas/AlertasEmailConfig';
import AlertasWebhookConfig from '@/components/conectores/alertas/AlertasWebhookConfig';
import AlertasTiposConfig from '@/components/conectores/alertas/AlertasTiposConfig';
import useAlertas from '@/components/conectores/hooks/useAlertas';

export default function ConfiguracaoAlertas() {
  const { form, setForm, save, isSaving } = useAlertas();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Alertas' }
      ]} />
      <ModuloNav />
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
        Configuração de Alertas
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertasEmailConfig form={form} onChange={setForm} />
          <AlertasWebhookConfig form={form} onChange={setForm} />
          <AlertasTiposConfig form={form} onChange={setForm} />
          <Button 
            onClick={save} 
            disabled={isSaving}
            className="w-full bg-[var(--brand-primary)]"
          >
            {isSaving ? 'Salvando...' : 'Salvar Configuração'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}