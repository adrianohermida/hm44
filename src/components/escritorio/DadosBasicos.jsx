import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

export default function DadosBasicos({ data, onChange, disabled }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
          <Building2 className="w-5 h-5" />
          Informações Básicas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="tipo">Tipo de Estrutura</Label>
          <Select 
            value={data.tipo || 'autonomo'} 
            onValueChange={(v) => onChange('tipo', v)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="autonomo">Advogado Autônomo</SelectItem>
              <SelectItem value="unipessoal">Sociedade Unipessoal de Advocacia</SelectItem>
              <SelectItem value="sociedade">Sociedade de Advogados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="nome">Nome do Escritório</Label>
          <Input
            id="nome"
            value={data.nome || ''}
            onChange={(e) => onChange('nome', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="razao_social">Razão Social</Label>
          <Input
            id="razao_social"
            value={data.razao_social || ''}
            onChange={(e) => onChange('razao_social', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            value={data.cnpj || ''}
            onChange={(e) => onChange('cnpj', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={data.descricao || ''}
            onChange={(e) => onChange('descricao', e.target.value)}
            disabled={disabled}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}