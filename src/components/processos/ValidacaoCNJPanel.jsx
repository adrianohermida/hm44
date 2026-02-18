import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Loader2, CheckCircle } from 'lucide-react';

export default function ValidacaoCNJPanel({ 
  numeroCNJ, 
  onChange, 
  onValidar, 
  validando, 
  validado, 
  escritorioDisponivel 
}) {
  return (
    <div className="relative">
      <Label>Número CNJ *</Label>
      <div className="flex gap-2">
        <Input 
          placeholder="0000000-00.0000.0.00.0000"
          value={numeroCNJ}
          onChange={(e) => onChange(e.target.value)}
          required
          disabled={validando}
          className="flex-1"
        />
        <Button 
          type="button"
          onClick={onValidar}
          disabled={!numeroCNJ || validando || !escritorioDisponivel}
          variant={validado ? "default" : "outline"}
          className="min-w-[140px]"
        >
          {validando ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Validando...</>
          ) : validado ? (
            <><CheckCircle className="w-4 h-4 mr-2" />Validado</>
          ) : (
            <><Search className="w-4 h-4 mr-2" />Validar CNJ</>
          )}
        </Button>
      </div>
      <p className="text-xs text-[var(--text-tertiary)] mt-1">
        Valida e preenche dados automaticamente do Escavador
      </p>
    </div>
  );
}