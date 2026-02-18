import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import ImportarArtigoModal from './ImportarArtigoModal';

export default function BlogHeader({ onNovo, onArtigoImportado }) {
  const [showImportar, setShowImportar] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Blog</h1>
          <p className="text-gray-600">Gerenciar artigos publicados</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImportar(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button onClick={onNovo}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Artigo
          </Button>
        </div>
      </div>

      <ImportarArtigoModal
        open={showImportar}
        onClose={() => setShowImportar(false)}
        onImportar={(dados) => {
          onArtigoImportado(dados);
          setShowImportar(false);
        }}
      />
    </>
  );
}