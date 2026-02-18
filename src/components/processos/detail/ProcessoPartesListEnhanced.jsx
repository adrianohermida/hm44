import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, User as UserIcon, Briefcase, Phone, Mail, ChevronDown, ChevronUp, Scale, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProcessoParteItem from './ProcessoParteItem';

export default function ProcessoPartesListEnhanced({ 
  partes, 
  onAdd, 
  onEdit, 
  onDelete, 
  onChangePolo,
  onMarcarCliente,
  onRemoverAdvogado,
  processoId
}) {
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes-processo', processoId],
    queryFn: async () => {
      const cpfsCnpjs = partes
        .filter(p => p.cpf_cnpj)
        .map(p => p.cpf_cnpj);
      
      if (cpfsCnpjs.length === 0) return [];
      
      const clientesEncontrados = await base44.entities.Cliente.list();
      return clientesEncontrados.filter(c => cpfsCnpjs.includes(c.cpf || c.cnpj || c.cpf_cnpj));
    },
    enabled: !!partes?.length
  });

  // Deduplicar partes por CPF/CNPJ
  const partesDeduplicated = useMemo(() => {
    const grupos = {};
    
    partes.forEach(parte => {
      const key = parte.cpf_cnpj || `${parte.nome}-${parte.tipo_parte}`;
      
      if (!grupos[key]) {
        const clienteEncontrado = clientes.find(c => 
          (c.cpf && c.cpf === parte.cpf_cnpj) || 
          (c.cnpj && c.cnpj === parte.cpf_cnpj) ||
          (c.cpf_cnpj && c.cpf_cnpj === parte.cpf_cnpj)
        );
        
        grupos[key] = {
          ...parte,
          cliente: clienteEncontrado,
          qualificacoes: [parte.qualificacao].filter(Boolean),
          partesOriginais: [parte]
        };
      } else {
        if (parte.qualificacao && !grupos[key].qualificacoes.includes(parte.qualificacao)) {
          grupos[key].qualificacoes.push(parte.qualificacao);
        }
        grupos[key].partesOriginais.push(parte);
      }
    });
    
    return Object.values(grupos);
  }, [partes, clientes]);

  if (!partes?.length) return null;

  const poloAtivo = partesDeduplicated.filter(p => p.tipo_parte === 'polo_ativo');
  const poloPassivo = partesDeduplicated.filter(p => p.tipo_parte === 'polo_passivo');
  const terceiros = partesDeduplicated.filter(p => p.tipo_parte === 'terceiro_interessado');

  const PartesSection = ({ titulo, partesLista, color }) => {
    const [showAdvogados, setShowAdvogados] = useState(false);
    const [collapsed, setCollapsed] = useState(partesLista.length > 5);
    const [limit, setLimit] = useState(5);
    
    if (partesLista.length === 0) return null;
    
    const partesVisiveis = collapsed ? partesLista.slice(0, limit) : partesLista;
    const temMais = partesLista.length > limit;

    // Extrair todos advogados únicos desta seção
    const advogadosUnicos = partesLista
      .flatMap(p => (p.advogados || []).map(adv => ({
        ...adv,
        parteNome: p.nome,
        parteId: p.id
      })))
      .reduce((acc, adv) => {
        const key = `${adv.nome}-${adv.oab_numero}-${adv.oab_uf}`;
        if (!acc[key]) {
          acc[key] = { ...adv, partes: [{ nome: adv.parteNome, id: adv.parteId }] };
        } else {
          acc[key].partes.push({ nome: adv.parteNome, id: adv.parteId });
        }
        return acc;
      }, {});

    const advogadosArray = Object.values(advogadosUnicos);

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`h-1 w-8 rounded ${color}`} />
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              {titulo}
            </h4>
            <Badge variant="outline" className="text-xs">
              {partesLista.length}
            </Badge>
          </div>
          {advogadosArray.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAdvogados(!showAdvogados)}
              className="text-xs"
            >
              <Scale className="w-3 h-3 mr-1" />
              {advogadosArray.length} advogado(s)
              {showAdvogados ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </Button>
          )}
        </div>

        {showAdvogados && advogadosArray.length > 0 && (
          <div className="mb-3 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Advogados deste polo:</p>
            <div className="space-y-2">
              {advogadosArray.map((adv, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <Scale className="w-3 h-3 text-[var(--brand-primary)]" />
                  <span className="font-medium text-[var(--text-primary)]">{adv.nome}</span>
                  {adv.oab_numero && adv.oab_uf && (
                    <Badge className="bg-[var(--brand-primary)] text-white text-xs">
                      {adv.oab_numero}/{adv.oab_uf}
                    </Badge>
                  )}
                  <span className="text-[var(--text-tertiary)]">
                    ({adv.partes.length} parte(s))
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          {partesVisiveis.map(parte => {
            const parteExibir = parte.cliente ? {
              ...parte,
              nome: parte.cliente.nome_completo,
              cliente_id: parte.cliente.id,
              e_cliente_escritorio: true,
              qualificacao: parte.qualificacoes.join(', ')
            } : {
              ...parte,
              qualificacao: parte.qualificacoes.join(', ')
            };
            
            return (
              <div key={parte.id}>
                <ProcessoParteItem 
                  parte={parteExibir}
                  onEdit={() => onEdit(parte.partesOriginais[0])}
                  onDelete={() => onDelete(parte.partesOriginais[0].id)}
                  onChangePolo={() => onChangePolo(parte.partesOriginais[0])}
                  onRemoverAdvogado={onRemoverAdvogado}
                  processoId={processoId}
                />
                {parte.qualificacoes.length > 1 && (
                  <div className="mt-1 ml-4 text-xs text-[var(--text-tertiary)]">
                    <Users className="w-3 h-3 inline mr-1" />
                    {parte.partesOriginais.length} registros agrupados
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {temMais && collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => setCollapsed(false)}
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            Ver mais {partesLista.length - limit} parte(s)
          </Button>
        )}
        
        {!collapsed && temMais && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => setCollapsed(true)}
          >
            <ChevronUp className="w-4 h-4 mr-1" />
            Ver menos
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PartesSection 
        titulo="Polo Ativo" 
        partesLista={poloAtivo}
        color="bg-green-500"
      />
      <PartesSection 
        titulo="Polo Passivo" 
        partesLista={poloPassivo}
        color="bg-red-500"
      />
      {terceiros.length > 0 && (
        <PartesSection 
          titulo="Terceiros Interessados" 
          partesLista={terceiros}
          color="bg-gray-400"
        />
      )}
    </div>
  );
}