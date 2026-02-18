import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function IDCopyButton({ id, label = 'ID' }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success('ID copiado');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border">
      <span className="text-xs text-[var(--text-tertiary)] font-medium">{label}:</span>
      <code className="text-xs font-mono text-[var(--text-primary)]">{id.slice(0, 8)}...</code>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="h-6 w-6 p-0"
      >
        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      </Button>
    </div>
  );
}