import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ConjugeBuscaModal({ open, onClose, onSelect, escritorioId }) {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    setLoading(true);
    try {
      const clientes = await base44.entities.Cliente.filter({
        escritorio_id: escritorioId,
        nome_completo: { $regex: busca, $options: 'i' }
      });
      setResultados(clientes);
    } catch (err) {
      toast.error('Erro ao buscar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buscar Cônjuge</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Nome" value={busca} onChange={(e) => setBusca(e.target.value)} />
            <Button onClick={buscar} disabled={loading}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {resultados.map(c => (
              <Button key={c.id} variant="outline" className="w-full justify-start" onClick={() => onSelect(c)}>
                {c.nome_completo} {c.cpf && `- ${c.cpf}`}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}