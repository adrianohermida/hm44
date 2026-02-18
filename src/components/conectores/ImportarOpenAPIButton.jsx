import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ImportarOpenAPIButton({ conectorId, onImported }) {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const importar = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('importarOpenAPI', {
        conector_id: conectorId,
        openapi_url: url
      });
      toast.success(`${data.importados} endpoints importados`);
      setShow(false);
      onImported();
    } catch {
      toast.error('Erro ao importar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setShow(true)}>
        <Download className="w-4 h-4 mr-2" />
        Importar OpenAPI
      </Button>
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar OpenAPI/Swagger</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="URL do spec OpenAPI" value={url} onChange={e => setUrl(e.target.value)} />
            <Button onClick={importar} disabled={loading} className="w-full">
              {loading ? 'Importando...' : 'Importar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}