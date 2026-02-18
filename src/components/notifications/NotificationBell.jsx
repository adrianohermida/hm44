import React from 'react';
import { Bell, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useNotifications from '@/components/hooks/useNotifications';
import useImportNotifications from '@/components/hooks/useImportNotifications';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotifications();
  const { importNotifications, hasActiveImports } = useImportNotifications();
  const navigate = useNavigate();

  const handleClick = (notif) => {
    marcarLida(notif.id);
    if (notif.link_acao) navigate(notif.link_acao);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {(naoLidas + importNotifications.length) > 0 && (
            <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${hasActiveImports ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}>
              {naoLidas + importNotifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold">Notificações</h3>
          {naoLidas > 0 && (
            <Button variant="ghost" size="sm" onClick={() => marcarTodasLidas()}>
              Marcar todas lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-96">
          {importNotifications.length === 0 && notificacoes.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Nenhuma notificação
            </div>
          ) : (
            <>
              {importNotifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className="flex-col items-start p-3 cursor-pointer bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-2 w-full">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{n.titulo}</div>
                      <div className="text-xs text-gray-600 mt-1">{n.mensagem}</div>
                      {n.dados_extras?.progress && (
                        <Progress value={n.dados_extras.progress} className="mt-2 h-1" />
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              {importNotifications.length > 0 && notificacoes.length > 0 && (
                <DropdownMenuSeparator />
              )}
              {notificacoes.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className="flex-col items-start p-3 cursor-pointer"
                >
                  <div className="font-medium text-sm">{n.titulo}</div>
                  <div className="text-xs text-gray-600 mt-1">{n.mensagem}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.created_date), { locale: ptBR, addSuffix: true })}
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}