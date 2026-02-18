import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

export default function ClienteSelector({ clientes, selectedCliente, onSelectCliente }) {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-teal-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <Label htmlFor="cliente-select" className="text-base font-semibold text-slate-900 mb-2 block">
              Selecione o Cliente
            </Label>
            <Select
              value={selectedCliente?.id || ""}
              onValueChange={(value) => {
                const cliente = clientes.find(c => c.id === value);
                onSelectCliente(cliente);
              }}
            >
              <SelectTrigger id="cliente-select" className="w-full bg-white">
                <SelectValue placeholder="Escolha um cliente..." />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome_completo} - CPF: {cliente.cpf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}