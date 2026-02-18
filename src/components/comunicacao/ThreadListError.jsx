import React from 'react';
import { AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ThreadListError({ error, retry }) {
  const isEscritorioError = error?.message?.includes('escritório');

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">Erro ao carregar conversas</h3>
      <p className="text-gray-600 mb-6">{error?.message || 'Tente novamente'}</p>
      <div className="flex gap-3">
        <Button onClick={retry}>Tentar Novamente</Button>
        {isEscritorioError && (
          <Button variant="outline" asChild>
            <Link to={createPageUrl('Settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar Perfil
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}