import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { PanelRight, Eye } from 'lucide-react';
import ProcessoSidebarContent from './ProcessoSidebarContent';

export default function ProcessoSidebarResponsive({ isMobile, ...sidebarProps }) {
  if (!sidebarProps.processo) return null;
  
  if (!isMobile) {
    return (
      <aside className="lg:self-start">
        <ProcessoSidebarContent {...sidebarProps} />
      </aside>
    );
  }

  const MobileComponent = window.innerWidth < 768 ? Drawer : Sheet;
  const MobileTrigger = window.innerWidth < 768 ? DrawerTrigger : SheetTrigger;
  const MobileContent = window.innerWidth < 768 ? DrawerContent : SheetContent;

  return (
    <MobileComponent>
      <MobileTrigger asChild>
        <Button 
          variant="outline" 
          size={window.innerWidth < 768 ? 'default' : 'icon'}
          className="fixed right-4 bottom-4 lg:hidden shadow-lg z-50"
        >
          {window.innerWidth < 768 ? (
            <><Eye className="w-4 h-4 mr-2" />Visão Geral</>
          ) : (
            <PanelRight className="w-5 h-5" />
          )}
        </Button>
      </MobileTrigger>
      <MobileContent side={window.innerWidth < 768 ? 'bottom' : 'right'}>
        <div className="p-4 overflow-y-auto max-h-[80vh]">
          <ProcessoSidebarContent {...sidebarProps} isMobile={true} />
        </div>
      </MobileContent>
    </MobileComponent>
  );
}