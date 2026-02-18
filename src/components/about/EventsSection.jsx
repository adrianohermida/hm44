import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function EventsSection() {
  const events = [
    {
      title: 'Palestrante na Fenalaw 2019',
      description: 'Participou como palestrante da 16ª Edição da Fenalaw - Maior Feira e Congresso para o Mercado Jurídico da América Latina',
      date: '23 a 25 de Outubro de 2019',
      location: 'Centro de Convenções Frei Caneca - São Paulo/SP',
      topic: 'Gestão para PMEs - Apresentação sobre soluções tecnológicas e gestão jurídica para pequenos e médios escritórios',
      image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/b19c7bd69_fenalaw2019.jpg',
      certificateImage: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/d8749c261_fenalaw-1.jpg'
    }
  ];

  return (
    <section className="py-20 bg-[var(--navy-900)]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            Participação em Eventos
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Eventos e Palestras
          </h2>
          <p className="text-xl text-gray-300">
            Compartilhando conhecimento nos principais eventos do setor jurídico
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:shadow-2xl transition-all">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-80 md:h-auto">
                    <img 
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[var(--brand-primary)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Palestrante
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                      {event.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--text-secondary)]">{event.date}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--text-secondary)]">{event.location}</span>
                      </div>
                    </div>

                    <div className="bg-[var(--brand-primary-50)] dark:bg-[var(--brand-primary-900)] rounded-lg p-4 border-l-4 border-[var(--brand-primary)]">
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold mb-1">
                        Tema apresentado:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {event.topic}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}