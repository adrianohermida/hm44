import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Globe, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Breadcrumb from "@/components/seo/Breadcrumb";
import PublicSidebar from "@/components/editor-plano/PublicSidebar";

export default function OndeConciliar() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [tipoFilter, setTipoFilter] = useState("all");

  useEffect(() => {
    loadLocais();
  }, []);

  const loadLocais = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.LocalConciliacao.filter({ ativo: true });
      setLocais(data);
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
    }
    setLoading(false);
  };

  const filteredLocais = locais.filter(local => {
    const matchesSearch = local.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         local.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === "all" || local.estado === estadoFilter;
    const matchesTipo = tipoFilter === "all" || local.tipo === tipoFilter;
    return matchesSearch && matchesEstado && matchesTipo;
  });

  const estados = [...new Set(locais.map(l => l.estado))].sort();

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex">
      <PublicSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <Breadcrumb items={[{ label: 'Onde Conciliar' }]} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            Onde Conciliar suas Dívidas
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Encontre Procons e CEJUSC próximos para resolver suas pendências
          </p>
        </motion.div>

        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-[var(--text-tertiary)]" />
                <Input
                  placeholder="Buscar por cidade ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>
                  {estados.map(estado => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="procon">Procon</SelectItem>
                  <SelectItem value="cejusc">CEJUSC</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocais.map((local, index) => (
            <motion.div
              key={local.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(`LocalDetalhes?id=${local.id}`)}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge className={local.tipo === 'procon' ? 'bg-blue-500' : 'bg-purple-500'}>
                          {local.tipo.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge variant="outline">{local.estado}</Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                      {local.nome}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span>{local.cidade}, {local.estado}</span>
                      </div>
                      
                      {local.telefone && (
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Phone className="w-4 h-4" />
                          <span>{local.telefone}</span>
                        </div>
                      )}
                      
                      {local.horario_funcionamento && (
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Clock className="w-4 h-4" />
                          <span>{local.horario_funcionamento}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredLocais.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <MapPin className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--text-secondary)] mb-2">
                Nenhum local encontrado
              </h3>
              <p className="text-[var(--text-tertiary)]">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}