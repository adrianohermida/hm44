import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MultiValueInput({ label, values = [], onChange, placeholder }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onChange([...values, input.trim()]);
      setInput('');
    }
  };

  const handleRemove = (idx) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{label}</label>
      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" size="sm" onClick={handleAdd} variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {values.map((val, idx) => (
          <Badge key={idx} variant="secondary" className="gap-1">
            {val}
            <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemove(idx)} />
          </Badge>
        ))}
      </div>
    </div>
  );
}