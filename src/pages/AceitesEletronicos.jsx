import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield } from "lucide-react";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { format } from "date-fns";

export default function AceitesEletronicos() {
  const [aceites, setAceites] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
    const data = await base44.entities.AceiteEletronico.filter({ escritorio_id: userData.escritorio_id }, '-created_date');
    setAceites(data);
    setLoading(false);
  };

  const filteredAceites = aceites.filter(a => 
    a.nome?.toLowerCase().includes(search.toLowerCase()) || 
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const origemLabels = {
    cadastro: "Cadastro",
    onboarding: "Onboarding",
    plano_pagamento: "Plano Pagamento",
    lead_magnet: "Lead Magnet",
    contato: "Contato"
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb items={[{ label: 'Aceites Eletrônicos' }]} />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[var(--brand-primary)]" />
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Aceites Eletrônicos</h1>
              <p className="text-[var(--text-secondary)]">Registro de consentimentos e aceites de termos</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Registros de Aceites</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] w-4 h-4" />
                <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[var(--bg-secondary)]">
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell></TableRow>
                ) : filteredAceites.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">Nenhum registro</TableCell></TableRow>
                ) : (
                  filteredAceites.map((aceite) => (
                    <TableRow key={aceite.id}>
                      <TableCell className="font-medium">{aceite.nome}</TableCell>
                      <TableCell>{aceite.email}</TableCell>
                      <TableCell><Badge variant="outline">{origemLabels[aceite.origem]}</Badge></TableCell>
                      <TableCell className="text-sm">{format(new Date(aceite.created_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell className="text-sm">{aceite.ip_address}</TableCell>
                      <TableCell>
                        <Badge className="bg-[var(--brand-success)] text-white">Aceito</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}