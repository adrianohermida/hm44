import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function KanbanEmptyState() {
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Inbox className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Nenhum prazo pendente no Kanban</p>
        <Button onClick={() => navigate(createPageUrl('Prazos'))}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Primeiro Prazo
        </Button>
      </CardContent>
    </Card>
  );
}