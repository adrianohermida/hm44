import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Ban } from 'lucide-react';

export default function BanListManager({ onBan }) {
  const [email, setEmail] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleBan = () => {
    if (email) {
      onBan({ email, motivo });
      setEmail('');
      setMotivo('');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <Ban className="w-5 h-5 text-red-600" />
        Banir de Campanhas
      </h3>
      <div className="space-y-3">
        <Input 
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Textarea 
          placeholder="Motivo do banimento (opcional)"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
        <Button onClick={handleBan} disabled={!email} className="w-full bg-red-600">
          Banir Email
        </Button>
      </div>
    </Card>
  );
}