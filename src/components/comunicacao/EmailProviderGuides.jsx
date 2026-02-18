import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailProviderGuides() {
  const webhookUrl = `${window.location.origin}/api/functions/receiveEmail`;

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL copiado');
  };

  const cloudflareWorkerCode = `export default {
  async email(message, env, ctx) {
    const webhookUrl = "${webhookUrl}";
    
    const emailData = {
      from: message.from,
      to: message.to,
      subject: message.headers.get("subject"),
      body: await new Response(message.raw).text(),
      received_at: new Date().toISOString()
    };
    
    await fetch(webhookUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-webhook-secret": env.WEBHOOK_SECRET || "test"
      },
      body: JSON.stringify(emailData)
    });
  }
}`;

  const sendgridCode = `Webhook URL: ${webhookUrl}
HTTP Post URL: Cole a URL acima
Authorization: Bearer [seu-token] (opcional)`;

  const gmailScript = `function forwardToWebhook(e) {
  const webhookUrl = "${webhookUrl}";
  
  const message = GmailApp.getMessageById(e.messageId);
  const emailData = {
    from: message.getFrom(),
    to: message.getTo(),
    subject: message.getSubject(),
    body: message.getPlainBody(),
    received_at: new Date().toISOString()
  };
  
  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(emailData),
    headers: {
      "x-webhook-secret": "test"
    }
  });
}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
          Guias de Integração de Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <strong>Importante:</strong> Domínios preview-sandbox são temporários. 
            Use um domínio próprio ou serviço de email para produção.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="cloudflare" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
            <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
            <TabsTrigger value="gmail">Gmail</TabsTrigger>
            <TabsTrigger value="mailgun">Mailgun</TabsTrigger>
          </TabsList>

          <TabsContent value="cloudflare" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Cloudflare Email Workers</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Acesse Cloudflare Dashboard → Email Routing</li>
                <li>Ative Email Routing para seu domínio</li>
                <li>Vá em Workers & Pages → Create Worker</li>
                <li>Cole o código abaixo:</li>
              </ol>
            </div>

            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                {cloudflareWorkerCode}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(cloudflareWorkerCode);
                  toast.success('Código copiado');
                }}
                className="absolute top-2 right-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <ol className="text-sm space-y-2 list-decimal list-inside" start="5">
                <li>Deploy do Worker</li>
                <li>Em Email Routing → Routes → Create Route</li>
                <li>Configure: <code className="bg-gray-100 px-1 rounded">*@seudominio.com</code> → Worker criado</li>
              </ol>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://developers.cloudflare.com/email-routing/email-workers/', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Documentação Cloudflare
            </Button>
          </TabsContent>

          <TabsContent value="sendgrid" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">SendGrid Inbound Parse</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Acesse SendGrid → Settings → Inbound Parse</li>
                <li>Clique em "Add Host & URL"</li>
                <li>Configure seu domínio e subdomínio</li>
                <li>URL de destino:</li>
              </ol>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs break-all">{webhookUrl}</code>
                <Button size="sm" variant="ghost" onClick={copyWebhook}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <ol className="text-sm space-y-2 list-decimal list-inside" start="5">
                <li>Marque "POST the raw, full MIME message"</li>
                <li>Adicione registros MX ao seu DNS conforme instruções</li>
              </ol>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Documentação SendGrid
            </Button>
          </TabsContent>

          <TabsContent value="gmail" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Gmail + Google Apps Script</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Acesse script.google.com</li>
                <li>Crie novo projeto</li>
                <li>Cole o código abaixo:</li>
              </ol>
            </div>

            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                {gmailScript}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(gmailScript);
                  toast.success('Código copiado');
                }}
                className="absolute top-2 right-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <ol className="text-sm space-y-2 list-decimal list-inside" start="4">
                <li>Salve o script</li>
                <li>Configure trigger: Gmail → onMessageReceived</li>
                <li>Autorize as permissões necessárias</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="mailgun" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Mailgun Routes</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Acesse Mailgun Dashboard → Receiving → Routes</li>
                <li>Clique em "Create Route"</li>
                <li>Expression Type: Match Recipient</li>
                <li>Recipient: <code className="bg-gray-100 px-1 rounded">*@seudominio.com</code></li>
                <li>Actions → Forward → URL:</li>
              </ol>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs break-all">{webhookUrl}</code>
                <Button size="sm" variant="ghost" onClick={copyWebhook}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <ol className="text-sm space-y-2 list-decimal list-inside" start="6">
                <li>Priority: 0</li>
                <li>Description: Forward to Base44</li>
                <li>Salve a rota</li>
              </ol>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://documentation.mailgun.com/en/latest/user_manual.html#routes', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Documentação Mailgun
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}