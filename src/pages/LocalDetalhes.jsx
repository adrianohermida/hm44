import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Clock, Navigation, Share2 } from "lucide-react";
import { toast } from "sonner";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { createPageUrl } from "@/utils";

export default function LocalDetalhes() {
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const urlParams = new URLSearchParams(window.location.search);
  const localId = urlParams.get('id');

  useEffect(() => {
    loadLocal();
  }, [localId]);

  const loadLocal = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.LocalConciliacao.filter({ id: localId });
      if (data.length > 0) {
        setLocal(data[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar local:", error);
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: local.nome,
        text: `Veja informações sobre ${local.nome}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado!');
    }
  };

  const openMaps = () => {
    if (local.latitude && local.longitude) {
      window.open(`https://www.google.com/maps?q=${local.latitude},${local.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.endereco_completo)}`, '_blank');
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!local) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-16 text-center">
            <p className="text-[var(--text-secondary)]">Local não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[
          { label: 'Onde Conciliar', url: createPageUrl('OndeConciliar') },
          { label: local.nome }
        ]} />

        <Card className="shadow-xl mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <Badge className={local.tipo === 'procon' ? 'bg-blue-500 mb-3' : 'bg-purple-500 mb-3'}>
                  {local.tipo.toUpperCase()}
                </Badge>
                <CardTitle className="text-3xl">{local.nome}</CardTitle>
                <p className="text-[var(--text-secondary)] mt-2">
                  {local.cidade}, {local.estado}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço
              </h3>
              <p className="text-[var(--text-secondary)]">{local.endereco_completo}</p>
              <Button variant="outline" className="mt-2" onClick={openMaps}>
                <Navigation className="w-4 h-4 mr-2" />
                Abrir no Maps
              </Button>
            </div>

            {local.telefone && (
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Telefone
                </h3>
                <a href={`tel:${local.telefone}`} className="text-[var(--brand-primary)] hover:underline">
                  {local.telefone}
                </a>
              </div>
            )}

            {local.email && (
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  E-mail
                </h3>
                <a href={`mailto:${local.email}`} className="text-[var(--brand-primary)] hover:underline">
                  {local.email}
                </a>
              </div>
            )}

            {local.site && (
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Website
                </h3>
                <a href={local.site} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-primary)] hover:underline">
                  {local.site}
                </a>
              </div>
            )}

            {local.horario_funcionamento && (
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horário de Funcionamento
                </h3>
                <p className="text-[var(--text-secondary)]">{local.horario_funcionamento}</p>
              </div>
            )}

            {local.servicos_oferecidos && local.servicos_oferecidos.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">
                  Serviços Oferecidos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {local.servicos_oferecidos.map((servico, index) => (
                    <Badge key={index} variant="outline">{servico}</Badge>
                  ))}
                </div>
              </div>
            )}

            {local.observacoes && (
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  Observações
                </h3>
                <p className="text-[var(--text-secondary)]">{local.observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}