import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { formatarCNJ } from '@/components/utils/cnjUtils';

export default function CNJCopyButton({ numeroCNJ, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formatarCNJ(numeroCNJ));
    setCopied(true);
    toast.success('CNJ copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={`gap-2 font-mono ${className}`}
    >
      {formatarCNJ(numeroCNJ)}
      {copied ? (
        <Check className="w-3 h-3 text-green-600" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </Button>
  );
}