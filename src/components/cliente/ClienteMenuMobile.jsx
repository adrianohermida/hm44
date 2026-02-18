import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, MessageSquare, Folder, Calendar, Settings, LogOut, Grid3x3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function ClienteMenuMobile({ user, stats }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Visão Geral", icon: Grid3x3, path: "MeuPainel" },
    { label: "Meus Processos", icon: FileText, path: "MeusProcessos", badge: stats?.processos },
    { label: "Suporte", icon: MessageSquare, path: "MeusTickets", badge: stats?.tickets },
    { label: "Documentos", icon: Folder, path: "MeusDocumentos" },
    { label: "Minha Agenda", icon: Calendar, path: "MinhaAgenda", badge: stats?.consultas },
  ];

  const handleNavigate = (path) => {
    navigate(createPageUrl(path));
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl("Home"));
  };

  return (
    <div className="md:hidden">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Grid3x3 className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-sm font-semibold">Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="gap-2 cursor-pointer"
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleNavigate("Profile")} className="gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setIsOpen(false); handleLogout(); }} className="gap-2 cursor-pointer text-red-600">
            <LogOut className="w-4 h-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}