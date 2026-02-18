import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, CheckCircle } from 'lucide-react';

export default function JuizosTable() {
  const [search, setSearch] = useState('');

  const { data: juizos = [], isLoading } = useQuery({
    queryKey: ['juizocnj'],
    queryFn: () => base44.entities.JuizoCNJ.list()
  });

  const filtered = juizos.filter(j => 
    !search || 
    j.nome_juizo?.toLowerCase().includes(search.toLowerCase()) ||
    j.nome_serventia?.toLowerCase().includes(search.toLowerCase()) ||
    j.tribunal?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Juízos CNJ</CardTitle>
          <Badge variant="outline">{juizos.length} registros</Badge>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome do juízo, serventia ou tribunal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tribunal</TableHead>
                <TableHead>UF</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Nome Serventia</TableHead>
                <TableHead>Nome Juízo</TableHead>
                <TableHead>100% Digital</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.tribunal}</TableCell>
                  <TableCell>{j.uf}</TableCell>
                  <TableCell>{j.numero_serventia || '-'}</TableCell>
                  <TableCell>{j.nome_serventia}</TableCell>
                  <TableCell>{j.nome_juizo}</TableCell>
                  <TableCell>
                    {j.juizo_100_digital && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}