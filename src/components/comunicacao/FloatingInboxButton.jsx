import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export default function FloatingInboxButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      className="md:hidden fixed bottom-6 left-4 z-50 h-14 w-14 rounded-full shadow-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-700)] border-2 border-white"
      size="icon"
      aria-label="Abrir menu de navegação"
    >
      <Menu className="w-6 h-6 text-white" />
    </Button>
  );
}