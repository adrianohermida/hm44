import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function TicketAssignment({ ticketId, currentResponsavel }) {
  const queryClient = useQueryClient();

  const { data: admins = [] } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const users = await base44.entities.User.list();
      return users.filter(u => u.role === 'admin');
    }
  });

  const assignMutation = useMutation({
    mutationFn: (email) => base44.entities.Ticket.update(ticketId, { 
      responsavel_email: email === 'ia' ? 'ia@sistema' : email === 'none' ? null : email 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', ticketId]);
      queryClient.invalidateQueries(['tickets-admin']);
      toast.success('Responsável atribuído');
    }
  });

  return (
    <Select value={currentResponsavel || 'none'} onValueChange={assignMutation.mutate}>
      <SelectTrigger className="text-sm">
        <SelectValue placeholder="Atribuir a..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Não atribuído</SelectItem>
        <SelectItem value="ia">🤖 Assistente IA</SelectItem>
        {admins.map(admin => (
          <SelectItem key={admin.id} value={admin.email}>
            {admin.full_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}