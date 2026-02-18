import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function RelatorioEmailsManager({ emails = [], onUpdate, isPending }) {
  const [novoEmail, setNovoEmail] = useState('');

  const handleAdd = () => {
    if (!novoEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) {
      toast.error('Email inválido');
      return;
    }
    if (emails.includes(novoEmail)) {
      toast.error('Email já adicionado');
      return;
    }
    onUpdate([...emails, novoEmail]);
    setNovoEmail('');
  };

  const handleRemove = (email) => {
    onUpdate(emails.filter(e => e !== email));
  };

  return (
    <div className="space-y-2">
      <Label>Emails Adicionais (além dos admins)</Label>
      <div className="flex gap-2">
        <Input 
          type="email"
          placeholder="email@exemplo.com"
          value={novoEmail}
          onChange={(e) => setNovoEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} disabled={isPending}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {emails.map(email => (
          <Badge key={email} variant="secondary" className="gap-1">
            {email}
            <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemove(email)} />
          </Badge>
        ))}
      </div>
    </div>
  );
}