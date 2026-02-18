import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

export default function EmailListInput({ emails, onChange }) {
  const [input, setInput] = useState('');

  const adicionar = () => {
    if (input && !emails.includes(input)) {
      onChange([...emails, input]);
      setInput('');
    }
  };

  const remover = (email) => {
    onChange(emails.filter(e => e !== email));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input 
          placeholder="email@example.com"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && adicionar()}
        />
        <Button type="button" variant="outline" onClick={adicionar}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {emails?.map(email => (
          <Badge key={email} variant="secondary" className="gap-1">
            {email}
            <X className="w-3 h-3 cursor-pointer" onClick={() => remover(email)} />
          </Badge>
        ))}
      </div>
    </div>
  );
}