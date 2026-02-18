import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroBanner({ event, onRegisterClick }) {
  return (
    <div className="relative bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-700)] py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {event.titulo}
        </h1>
        <p className="text-xl text-white/90 mb-8">
          {event.descricao}
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-8 text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{event.data}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{event.local}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{event.vagas} vagas</span>
          </div>
        </div>

        <Button 
          onClick={onRegisterClick}
          size="lg"
          className="bg-white text-[var(--brand-primary)] hover:bg-white/90 font-bold px-8"
        >
          Inscreva-se Agora
        </Button>
      </div>
    </div>
  );
}