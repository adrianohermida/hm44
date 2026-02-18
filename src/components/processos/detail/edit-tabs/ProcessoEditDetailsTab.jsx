import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProcessoEditDetailsTab({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Instância</Label>
          <Input
            value={formData.instancia}
            onChange={e => setFormData({...formData, instancia: e.target.value})}
            placeholder="Ex: 1ª Instância"
          />
        </div>
        <div>
          <Label>Classe</Label>
          <Input
            value={formData.classe}
            onChange={e => setFormData({...formData, classe: e.target.value})}
            placeholder="Ex: Procedimento Comum"
          />
        </div>
      </div>

      <div>
        <Label>Assunto</Label>
        <Input
          value={formData.assunto}
          onChange={e => setFormData({...formData, assunto: e.target.value})}
          placeholder="Ex: Responsabilidade Civil"
        />
      </div>

      <div>
        <Label>Área</Label>
        <Input
          value={formData.area}
          onChange={e => setFormData({...formData, area: e.target.value})}
          placeholder="Ex: Direito Civil"
        />
      </div>

      <div>
        <Label>Órgão Julgador</Label>
        <Input
          value={formData.orgao_julgador}
          onChange={e => setFormData({...formData, orgao_julgador: e.target.value})}
          placeholder="Ex: 1ª Vara Cível"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Data de Distribuição</Label>
          <Input
            type="date"
            value={formData.data_distribuicao}
            onChange={e => setFormData({...formData, data_distribuicao: e.target.value})}
          />
        </div>
        <div>
          <Label>Valor da Causa</Label>
          <Input
            value={formData.valor_causa}
            onChange={e => setFormData({...formData, valor_causa: e.target.value})}
            placeholder="Ex: R$ 10.000,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Polo Ativo</Label>
          <Input
            value={formData.polo_ativo || ''}
            onChange={e => setFormData({...formData, polo_ativo: e.target.value})}
            placeholder="Ex: João da Silva"
          />
        </div>
        <div>
          <Label>Polo Passivo</Label>
          <Input
            value={formData.polo_passivo || ''}
            onChange={e => setFormData({...formData, polo_passivo: e.target.value})}
            placeholder="Ex: Empresa XYZ Ltda"
          />
        </div>
      </div>

      <div>
        <Label>Fonte de Origem</Label>
        <Input
          value={formData.fonte_origem || ''}
          onChange={e => setFormData({...formData, fonte_origem: e.target.value})}
          placeholder="Ex: CNJ, OAB, Nome, Importação CSV"
        />
      </div>

      <div>
        <Label>Observações</Label>
        <Textarea
          value={formData.observacoes || ''}
          onChange={e => setFormData({...formData, observacoes: e.target.value})}
          placeholder="Anotações internas sobre o processo"
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="favorito"
            checked={formData.favorito || false}
            onCheckedChange={v => setFormData({...formData, favorito: v})}
          />
          <Label htmlFor="favorito" className="cursor-pointer">
            Marcar como favorito
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="visivel"
            checked={formData.visivel !== false}
            onCheckedChange={v => setFormData({...formData, visivel: v})}
          />
          <Label htmlFor="visivel" className="cursor-pointer">
            Processo visível
          </Label>
        </div>
      </div>
    </div>
  );
}