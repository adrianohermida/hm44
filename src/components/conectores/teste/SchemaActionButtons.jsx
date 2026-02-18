import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function SchemaActionButtons({ schema, onSave }) {
  const copySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    toast.success('Schema copiado para área de transferência');
  };

  const [viewing, setViewing] = React.useState(false);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copySchema} className="flex-1">
          <Copy className="w-3 h-3 mr-1" />Copiar
        </Button>
        <Button variant="outline" size="sm" onClick={onSave} className="flex-1">
          <Save className="w-3 h-3 mr-1" />Salvar
        </Button>
        <Button variant="outline" size="sm" onClick={() => setViewing(!viewing)} className="flex-1">
          <Eye className="w-3 h-3 mr-1" />Ver
        </Button>
      </div>
      {viewing && (
        <pre className="bg-[var(--bg-secondary)] p-2 rounded text-xs overflow-x-auto max-h-40">
          {JSON.stringify(schema, null, 2)}
        </pre>
      )}
    </div>
  );
}