import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

export default function CredorForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome_credor: "",
    tipo_credor: "banco",
    cnpj_cpf: "",
    telefone_contato: "",
    email_contato: "",
    endereco: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-[var(--brand-primary)] to-teal-500 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Novo Credor</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nome_credor">Nome do Credor *</Label>
                <Input id="nome_credor" value={formData.nome_credor} onChange={(e) => setFormData(prev => ({ ...prev, nome_credor: e.target.value }))} placeholder="Nome da instituição ou pessoa" required />
              </div>
              <div>
                <Label htmlFor="tipo_credor">Tipo *</Label>
                <Select value={formData.tipo_credor} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_credor: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banco">Banco</SelectItem>
                    <SelectItem value="financeira">Financeira</SelectItem>
                    <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="loja">Loja</SelectItem>
                    <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cnpj_cpf">CNPJ/CPF</Label>
                <Input id="cnpj_cpf" value={formData.cnpj_cpf} onChange={(e) => setFormData(prev => ({ ...prev, cnpj_cpf: e.target.value }))} placeholder="00.000.000/0000-00" />
              </div>
              <div>
                <Label htmlFor="telefone_contato">Telefone</Label>
                <Input id="telefone_contato" value={formData.telefone_contato} onChange={(e) => setFormData(prev => ({ ...prev, telefone_contato: e.target.value }))} placeholder="(00) 0000-0000" />
              </div>
              <div>
                <Label htmlFor="email_contato">E-mail</Label>
                <Input id="email_contato" type="email" value={formData.email_contato} onChange={(e) => setFormData(prev => ({ ...prev, email_contato: e.target.value }))} placeholder="contato@credor.com" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea id="endereco" value={formData.endereco} onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))} rows={2} placeholder="Endereço completo do credor..." />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-[var(--bg-secondary)] flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-700)]">
              <Save className="w-4 h-4 mr-2" />Cadastrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}