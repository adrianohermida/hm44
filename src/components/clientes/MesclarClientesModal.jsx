import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MesclarClientesModal({ open, onClose, clientes, onConfirm, loading }) {
  const [clientePrincipalId, setClientePrincipalId] = useState(clientes[0]?.id);

  const handleConfirm = () => {
    if (clientePrincipalId) {
      onConfirm(clientePrincipalId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Mesclar {clientes.length} clientes</DialogTitle>
          <DialogDescription>
            Selecione o registro que será mantido. Os dados dos outros serão mesclados nele.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <RadioGroup value={clientePrincipalId} onValueChange={setClientePrincipalId}>
            <div className="space-y-3">
              {clientes.map(cliente => (
                <div
                  key={cliente.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    clientePrincipalId === cliente.id
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]'
                      : 'border-[var(--border-primary)] hover:border-[var(--brand-primary-300)]'
                  }`}
                  onClick={() => setClientePrincipalId(cliente.id)}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={cliente.id} id={cliente.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor={cliente.id} className="text-base font-semibold cursor-pointer">
                          {cliente.nome_completo}
                        </Label>
                        {clientePrincipalId === cliente.id && (
                          <Badge className="bg-[var(--brand-primary)]">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {cliente.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                        {cliente.cpf_cnpj && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {cliente.tipo_pessoa === 'fisica' ? 'CPF:' : 'CNPJ:'}
                            </span>
                            <span>{cliente.cpf_cnpj}</span>
                          </div>
                        )}
                        
                        {cliente.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span>{cliente.email}</span>
                          </div>
                        )}
                        
                        {cliente.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span>{cliente.telefone}</span>
                          </div>
                        )}
                        
                        {cliente.endereco?.cidade && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>{cliente.endereco.cidade}/{cliente.endereco.estado}</span>
                          </div>
                        )}

                        <div className="flex gap-2 mt-2">
                          {cliente.emails_adicionais?.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {cliente.emails_adicionais.length} emails
                            </Badge>
                          )}
                          {cliente.telefones_adicionais?.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {cliente.telefones_adicionais.length} telefones
                            </Badge>
                          )}
                          {cliente.enderecos_adicionais?.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {cliente.enderecos_adicionais.length} endereços
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!clientePrincipalId || loading}
            className="bg-[var(--brand-primary)]"
          >
            {loading ? 'Mesclando...' : 'Mesclar Clientes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}