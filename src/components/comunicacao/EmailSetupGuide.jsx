import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Copy, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function EmailSetupGuide() {
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const webhookUrl = `${window.location.origin}/api/functions/receiveEmail`;

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL copiado');
  };

  const testWebhook = async () => {
    if (!testEmail) {
      toast.error('Digite um email de teste');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('/api/functions/receiveEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': 'test'
        },
        body: JSON.stringify({
          from: testEmail,
          subject: 'Teste de Recebimento',
          body: 'Este é um email de teste para validar o webhook.',
          to: 'suporte@escritorio.com',
          received_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Ticket criado: ${data.ticket_id}`);
      } else {
        toast.error('Erro ao processar webhook');
      }
    } catch (error) {
      toast.error('Erro: ' + error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
          Configuração de Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Para receber emails, configure um provedor de email (Gmail, SendGrid, Mailgun) para encaminhar mensagens ao webhook abaixo.
          </AlertDescription>
        </Alert>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Webhook URL (copie e configure no provedor):
          </label>
          <div className="flex gap-2">
            <Input value={webhookUrl} readOnly className="font-mono text-xs" />
            <Button size="sm" variant="outline" onClick={copyWebhook}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900">Formato esperado (JSON):</p>
          <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
{`{
  "from": "cliente@example.com",
  "to": "suporte@escritorio.com",
  "subject": "Assunto do email",
  "body": "Conteúdo da mensagem",
  "received_at": "2024-01-01T12:00:00Z"
}`}
          </pre>
        </div>

        <div className="space-y-2 p-3 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Opções de Integração:
          </p>
          <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
            <li>Gmail: Configurar filtros + Google Apps Script</li>
            <li>SendGrid: Inbound Parse Webhook</li>
            <li>Mailgun: Routes para webhook</li>
            <li>Zapier/Make: Email → Webhook</li>
          </ul>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Testar Webhook:</p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="email@teste.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <Button
              onClick={testWebhook}
              disabled={testing || !testEmail}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {testing ? 'Testando...' : 'Testar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}