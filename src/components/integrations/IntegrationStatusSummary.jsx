import React from 'react';
import { CheckCircle, XCircle, Calendar, FileText, Sheet, Presentation, HardDrive, Linkedin, Youtube } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function IntegrationStatusSummary() {
  const integrations = [
    { name: 'Google Calendar', icon: Calendar, status: 'connected', color: 'green' },
    { name: 'Google Drive', icon: HardDrive, status: 'connected', color: 'green' },
    { name: 'Google Sheets', icon: Sheet, status: 'connected', color: 'green' },
    { name: 'Google Docs', icon: FileText, status: 'connected', color: 'green' },
    { name: 'Google Slides', icon: Presentation, status: 'connected', color: 'green' },
    { name: 'LinkedIn', icon: Linkedin, status: 'connected', color: 'green' },
    { name: 'HubSpot', icon: FileText, status: 'connected', color: 'green' },
    { name: 'YouTube', icon: Youtube, status: 'api_key', color: 'blue' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status das Integrações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {integrations.map((int) => (
            <div key={int.name} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
              <div className="flex items-center gap-3">
                <int.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="font-medium text-[var(--text-primary)]">{int.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {int.status === 'connected' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Conectado</span>
                  </>
                )}
                {int.status === 'api_key' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">API Key Ativa</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}