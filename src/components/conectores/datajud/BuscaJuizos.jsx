import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, MapPin, Phone } from 'lucide-react';

function ServentiasTab({ escritorioId }) {
  const [busca, setBusca] = useState('');

  const { data: serventias = [] } = useQuery({
    queryKey: ['serventias', busca],
    queryFn: () => base44.entities.ServentiaCNJ.filter(
      busca ? { $or: [
        { nome_serventia: { $regex: busca, $options: 'i' } },
        { municipio: { $regex: busca, $options: 'i' } },
        { tribunal: { $regex: busca, $options: 'i' } }
      ]} : {},
      '-created_date',
      100
    ),
    enabled: !!escritorioId
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar serventia por nome, município ou tribunal..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {serventias.map((s) => (
            <div key={s.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{s.nome_serventia}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>{s.tribunal}</Badge>
                    <Badge variant="outline">{s.tipo_orgao}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>{s.municipio}/{s.uf}</span>
                </div>
                {s.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <span>{s.telefone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {serventias.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Nenhuma serventia encontrada
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function JuizosTab({ escritorioId }) {
  const [busca, setBusca] = useState('');

  const { data: juizos = [] } = useQuery({
    queryKey: ['juizos', busca],
    queryFn: () => base44.entities.JuizoCNJ.filter(
      busca ? { $or: [
        { nome_juizo: { $regex: busca, $options: 'i' } },
        { tribunal: { $regex: busca, $options: 'i' } },
        { uf: { $regex: busca, $options: 'i' } }
      ]} : {},
      '-created_date',
      100
    ),
    enabled: !!escritorioId
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar juízo por nome, tribunal ou UF..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {juizos.map((j) => (
            <div key={j.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{j.nome_juizo}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>{j.tribunal}</Badge>
                    <Badge variant="outline">{j.uf}</Badge>
                    {j.juizo_100_digital && (
                      <Badge className="bg-green-600">100% Digital</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Tipo:</strong> {j.tipo_unidade}</p>
                <p><strong>Grau:</strong> {j.grau}</p>
                {j.sistema_processual && (
                  <p><strong>Sistema:</strong> {j.sistema_processual}</p>
                )}
              </div>
            </div>
          ))}
          {juizos.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Nenhum juízo encontrado
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function CodigosForoTab({ escritorioId }) {
  const [busca, setBusca] = useState('');

  const { data: foros = [] } = useQuery({
    queryKey: ['foros-tjsp', busca],
    queryFn: () => base44.entities.CodigoForoTJSP.filter(
      busca ? { $or: [
        { nome: { $regex: busca, $options: 'i' } },
        { codigo: { $regex: busca, $options: 'i' } }
      ]} : {},
      'codigo',
      200
    ),
    enabled: !!escritorioId
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar código de foro TJSP..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {foros.map((f) => (
            <div key={f.id} className="border rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{f.nome}</p>
                <Badge variant="outline" className="mt-1">{f.tipo}</Badge>
              </div>
              <Badge className="bg-purple-600 font-mono">{f.codigo}</Badge>
            </div>
          ))}
          {foros.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Nenhum foro encontrado
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function BuscaJuizos({ escritorioId }) {
  return (
    <Tabs defaultValue="serventias">
      <TabsList>
        <TabsTrigger value="serventias">
          <Building2 className="w-4 h-4 mr-2" />
          Serventias CNJ
        </TabsTrigger>
        <TabsTrigger value="juizos">
          <Building2 className="w-4 h-4 mr-2" />
          Juízos CNJ
        </TabsTrigger>
        <TabsTrigger value="foros">
          <MapPin className="w-4 h-4 mr-2" />
          Códigos Foro TJSP
        </TabsTrigger>
      </TabsList>

      <TabsContent value="serventias">
        <ServentiasTab escritorioId={escritorioId} />
      </TabsContent>

      <TabsContent value="juizos">
        <JuizosTab escritorioId={escritorioId} />
      </TabsContent>

      <TabsContent value="foros">
        <CodigosForoTab escritorioId={escritorioId} />
      </TabsContent>
    </Tabs>
  );
}