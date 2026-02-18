import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { 
  MessageSquare, User, Calendar, FileText, DollarSign, 
  Shield, ExternalLink 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OnlineUsersModal({ open, onOpenChange }) {
  const navigate = useNavigate();

  const { data: currentUser } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users-online'],
    queryFn: async () => {
      const allUsers = await base44.entities.User.list();
      return allUsers.filter(u => u.id !== currentUser?.id);
    },
    enabled: !!currentUser && open
  });

  const handleAction = (action, user) => {
    switch (action) {
      case 'chat':
        const event = new CustomEvent('openChatWithUser', {
          detail: { userEmail: user.email, userName: user.full_name }
        });
        window.dispatchEvent(event);
        onOpenChange(false);
        break;
      case 'profile':
        navigate(createPageUrl('Profile') + `?user=${user.email}`);
        onOpenChange(false);
        break;
      case 'atendimentos':
        navigate(createPageUrl('Comunicacao') + `?user=${user.email}`);
        onOpenChange(false);
        break;
      case 'processos':
        navigate(createPageUrl('Processos') + `?responsavel=${user.email}`);
        onOpenChange(false);
        break;
      case 'financeiro':
        navigate(createPageUrl('Financeiro') + `?user=${user.email}`);
        onOpenChange(false);
        break;
      case 'permissoes':
        navigate(createPageUrl('Usuarios') + `?edit=${user.id}`);
        onOpenChange(false);
        break;
    }
  };

  const UserCard = ({ user }) => {
    const isCliente = user.role === 'user';
    const isEquipe = user.role === 'admin';

    return (
      <div className="flex items-start gap-4 p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] hover:shadow-md transition-shadow">
        <div className="relative">
          <CustomAvatar
            src={user.avatar}
            alt={user.full_name}
            fallback={user.full_name?.charAt(0) || 'U'}
            className="h-12 w-12"
            fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] font-semibold"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] truncate">
                {user.full_name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] truncate">{user.email}</p>
              <span className={cn(
                "inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium",
                isEquipe 
                  ? "bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]" 
                  : "bg-blue-100 text-blue-700"
              )}>
                {isEquipe ? 'Equipe' : 'Cliente'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('chat', user)}
              className="justify-start"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Conversa
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('profile', user)}
              className="justify-start"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </Button>

            {isEquipe && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction('atendimentos', user)}
                  className="justify-start"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Atendimentos
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction('processos', user)}
                  className="justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Processos
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction('financeiro', user)}
                  className="justify-start"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financeiro
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction('permissoes', user)}
                  className="justify-start"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Permissões
                </Button>
              </>
            )}

            {isCliente && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction('processos', user)}
                  className="justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Processos
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(createPageUrl('Home'), '_blank')}
                  className="justify-start"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Portal
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              Usuários Online
              <span className="inline-flex items-center justify-center w-6 h-6 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-full">
                {users.length}
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 overflow-y-auto pr-2">
          {users.length === 0 ? (
            <p className="text-center text-[var(--text-secondary)] py-8">
              Nenhum usuário online no momento
            </p>
          ) : (
            users.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}