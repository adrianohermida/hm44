import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Info, RefreshCw, Unplug } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const availableIntegrations = [
  { id: 'googlecalendar', name: 'Google Calendar', scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'] },
  { id: 'googledrive', name: 'Google Drive', scopes: ['https://www.googleapis.com/auth/drive.file'] },
  { id: 'googledocs', name: 'Google Docs', scopes: ['https://www.googleapis.com/auth/documents'] },
  { id: 'googlesheets', name: 'Google Sheets', scopes: ['https://www.googleapis.com/auth/spreadsheets'] },
  { id: 'googleslides', name: 'Google Slides', scopes: ['https://www.googleapis.com/auth/presentations'] },
  { id: 'slack', name: 'Slack', scopes: ['chat:write', 'users:read'] },
  { id: 'hubspot', name: 'HubSpot', scopes: ['crm.objects.contacts.read', 'crm.objects.contacts.write'] },
  { id: 'linkedin', name: 'LinkedIn', scopes: ['openid', 'profile', 'w_member_social'] }
];

export default function IntegrationSection() {
  const [loading, setLoading] = useState({});

  const handleDisconnect = async (integrationId) => {
    setLoading(prev => ({ ...prev, [integrationId]: true }));
    try {
      await base44.asServiceRole.connectors.disconnect(integrationId);
      toast.success('Integração desconectada');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Erro ao desconectar');
    }
    setLoading(prev => ({ ...prev, [integrationId]: false }));
  };

  const handleReconnect = async (integration) => {
    window.location.href = await base44.connectors.authorize(integration.id, integration.scopes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-[var(--brand-primary-50)] border-[var(--brand-primary-200)]">
          <Info className="h-4 w-4 text-[var(--brand-primary)]" />
          <AlertDescription className="text-[var(--text-secondary)]">
            Gerencie suas integrações conectadas. Você pode desconectar ou reconectar a qualquer momento.
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          {availableIntegrations.map(integration => (
            <div 
              key={integration.id}
              className="flex items-center justify-between p-3 border border-[var(--border-primary)] rounded-lg"
            >
              <span className="text-[var(--text-primary)] font-medium">{integration.name}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-[var(--brand-success)] text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Conectado</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReconnect(integration)}
                  disabled={loading[integration.id]}
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDisconnect(integration.id)}
                  disabled={loading[integration.id]}
                  className="text-red-600 hover:text-red-700"
                >
                  <Unplug className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}