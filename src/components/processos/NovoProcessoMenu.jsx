import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ImportadorLoteOtimizado from './import/ImportadorLoteOtimizado';
import BuscaLoteCNJ from './import/BuscaLoteCNJ';

export default function NovoProcessoMenu({ onNovo }) {
  const [modalOpen, setModalOpen] = useState(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[var(--brand-primary)] w-full md:w-auto" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onNovo}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastro Manual
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModalOpen('lote-cnj')}>
            <Search className="w-4 h-4 mr-2" />
            Busca em Lote (CNJ)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModalOpen('importar-csv')}>
            <Upload className="w-4 h-4 mr-2" />
            Importar CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={modalOpen === 'lote-cnj'} onOpenChange={(open) => !open && setModalOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Busca em Lote por CNJ</DialogTitle>
          </DialogHeader>
          <BuscaLoteCNJ onClose={() => setModalOpen(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'importar-csv'} onOpenChange={(open) => !open && setModalOpen(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Processos via CSV</DialogTitle>
          </DialogHeader>
          <ImportadorLoteOtimizado 
            onClose={() => setModalOpen(null)}
            onSuccess={() => {
              setModalOpen(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}