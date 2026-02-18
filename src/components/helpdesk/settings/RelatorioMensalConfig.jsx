import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Plus, Trash2, Mail } from 'lucide-react';

export default function RelatorioMensalConfig({ escritorioId }) {
  const queryClient = useQueryClient();
  const [novoEmail, setNovoEmail] = useState('');

  const { data: config } = useQuery({
    queryKey: ['config-agenda', escritorioId],
    queryFn: async () => {
      const result = await base44.entities.ConfiguracaoAgenda.filter({ 
        escritorio_id: escritorioId 
      });
      return result[0] || null;
    },
    enabled: !!escritorioId
  });

  const createMutation = useMutation({
    mutationFn: () => base44.entities.ConfiguracaoAgenda.create({
      escritorio_id: escritorioId,
      emails_relatorio_mensal: [novoEmail]
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['config-agenda']);
      setNovoEmail('');
      toast.success('Configuração criada');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (emails) => base44.entities.ConfiguracaoAgenda.update(config.id, {
      emails_relatorio_mensal: emails
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['config-agenda']);
      toast.success('Configuração atualizada');
    }
  });

  const handleAddEmail = () => {
    if (!novoEmail) return;
    const emails = config?.emails_relatorio_mensal || [];
    if (config) {
      updateMutation.mutate([...emails, novoEmail]);
    } else {
      createMutation.mutate();
    }
    setNovoEmail('');
  };

  const handleRemoveEmail = (email) => {
    const emails = config.emails_relatorio_mensal.filter(e => e !== email);
    updateMutation.mutate(emails);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Relatório Mensal Automático
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Configure emails para receber relatório mensal de tickets automaticamente no dia 1º de cada mês.
        </p>

        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="email@exemplo.com"
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
          />
          <Button onClick={handleAddEmail} disabled={!novoEmail}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {config?.emails_relatorio_mensal?.length > 0 && (
          <div className="space-y-2">
            {config.emails_relatorio_mensal.map((email, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{email}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => handleRemoveEmail(email)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}