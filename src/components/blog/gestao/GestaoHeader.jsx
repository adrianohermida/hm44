import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import ImportarArtigoModal from './ImportarArtigoModal';

export default function GestaoHeader({ onNovo, onArtigoImportado }) {
  const [showImport, setShowImport] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Blog</h1>
          <p className="text-gray-600 mt-1">Gerencie artigos, SEO e performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Download className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button onClick={onNovo} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Artigo
          </Button>
        </div>
      </div>

      <ImportarArtigoModal
        open={showImport}
        onClose={() => setShowImport(false)}
        onSuccess={(artigo) => {
          setShowImport(false);
          onArtigoImportado?.(artigo);
        }}
      />
    </>
  );
}