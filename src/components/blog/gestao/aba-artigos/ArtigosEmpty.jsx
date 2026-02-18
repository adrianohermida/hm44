import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export default function ArtigosEmpty({ onCriar }) {
  return (
    <Card className="p-12 text-center">
      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Nenhum artigo encontrado
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Comece a criar conteúdo otimizado para SEO
      </p>
      <Button onClick={onCriar}>
        <Plus className="w-4 h-4 mr-2" />
        Criar Primeiro Artigo
      </Button>
    </Card>
  );
}