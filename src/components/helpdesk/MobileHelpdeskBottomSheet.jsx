import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import ClienteContextSidebar from './ticket/ClienteContextSidebar';

export default function MobileHelpdeskBottomSheet({ ticket }) {
  if (!ticket) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="md:hidden">
          <User className="w-4 h-4 mr-1" />
          Ver Cliente
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Informações do Cliente</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100%-60px)] overflow-y-auto">
          <ClienteContextSidebar ticket={ticket} />
        </div>
      </SheetContent>
    </Sheet>
  );
}