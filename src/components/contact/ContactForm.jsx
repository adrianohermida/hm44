import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import FormField from "./FormField";

export default function ContactForm({ formData, onChange, onSubmit, isSubmitting }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField id="name" label="Nome Completo" required>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Seu nome"
            required
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </FormField>
        <FormField id="email" label="Email" required>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="seu@email.com"
            required
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </FormField>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField id="category" label="Categoria">
          <Select value={formData.category} onValueChange={(value) => onChange('category', value)}>
            <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consulta">Consulta Jurídica</SelectItem>
              <SelectItem value="dividas">Questão sobre Dívidas</SelectItem>
              <SelectItem value="processo">Acompanhamento de Processo</SelectItem>
              <SelectItem value="outro">Outro Assunto</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField id="subject" label="Assunto">
          <Input 
            id="subject" 
            value={formData.subject} 
            onChange={(e) => onChange('subject', e.target.value)} 
            placeholder="Breve descrição"
            className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
          />
        </FormField>
      </div>

      <FormField id="message" label="Mensagem" required>
        <Textarea 
          id="message" 
          value={formData.message} 
          onChange={(e) => onChange('message', e.target.value)} 
          rows={6} 
          required 
          placeholder="Descreva sua situação..."
          className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
        />
      </FormField>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] py-3">
        {isSubmitting ? "Enviando..." : <><Send className="w-5 h-5 mr-2" />Enviar Mensagem</>}
      </Button>
    </form>
  );
}