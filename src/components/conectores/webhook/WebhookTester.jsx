import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export default function WebhookTester({ url }) {
  const [payload, setPayload] = useState('{\n  "event": "test",\n  "data": {}\n}');
  const [loading, setLoading] = useState(false);

  const test = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      toast.success(`Status: ${res.status}`);
    } catch (err) {
      toast.error('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Testar Webhook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea 
          value={payload} 
          onChange={(e) => setPayload(e.target.value)}
          className="font-mono text-xs h-32"
        />
        <Button onClick={test} disabled={loading} className="w-full">
          <Send className="w-4 h-4 mr-2" /> Enviar
        </Button>
      </CardContent>
    </Card>
  );
}