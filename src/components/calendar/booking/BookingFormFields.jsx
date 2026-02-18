import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function BookingFormFields({ form, onChange }) {
  return (
    <>
      <Input 
        placeholder="Nome completo" 
        value={form.nome} 
        onChange={(e) => onChange({...form, nome: e.target.value})} 
        required 
        aria-label="Nome completo" 
      />
      <Input 
        type="email" 
        placeholder="Email" 
        value={form.email} 
        onChange={(e) => onChange({...form, email: e.target.value})} 
        required 
        aria-label="Email" 
      />
      <Input 
        placeholder="Telefone" 
        value={form.telefone} 
        onChange={(e) => onChange({...form, telefone: e.target.value})} 
        required 
        aria-label="Telefone" 
      />
      <Textarea 
        placeholder="Descreva brevemente o motivo da consulta" 
        value={form.motivo} 
        onChange={(e) => onChange({...form, motivo: e.target.value})} 
        required 
        aria-label="Motivo da consulta" 
        className="min-h-[100px]" 
      />
    </>
  );
}