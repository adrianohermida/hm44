import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Youtube, Play, TrendingUp, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

export default function VideoContentSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50" aria-labelledby="video-section-title">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full mb-4">
            <Youtube className="w-5 h-5" aria-hidden="true" />
            <span className="font-semibold text-sm">Conteúdo Audiovisual</span>
          </div>
          <h2 id="video-section-title" className="text-4xl font-bold text-[var(--text-primary)] mb-4">
            Aprenda com Vídeos Rápidos
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Dicas jurídicas essenciais em formato curto para você entender seus direitos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <Play className="w-12 h-12 text-red-600 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Shorts Educativos
            </h3>
            <p className="text-[var(--text-secondary)]">
              Vídeos de até 60 segundos explicando seus direitos sobre dívidas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <TrendingUp className="w-12 h-12 text-red-600 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Casos Reais
            </h3>
            <p className="text-[var(--text-secondary)]">
              Exemplos práticos de sucesso na defesa do devedor
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <Youtube className="w-12 h-12 text-red-600 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Atualizações Legais
            </h3>
            <p className="text-[var(--text-secondary)]">
              Mudanças na legislação que afetam sua situação financeira
            </p>
          </motion.div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            asChild
            size="lg"
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white px-8 py-3 rounded-full shadow-lg"
          >
            <Link to={createPageUrl('Videos')}>
              <Video className="w-5 h-5 mr-2" aria-hidden="true" />
              Ver Galeria de Vídeos
            </Link>
          </Button>
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-full"
            aria-label="Acessar canal no YouTube"
          >
            <a 
              href="https://www.youtube.com/@dr.adrianohermidamaia" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Youtube className="w-5 h-5 mr-2" aria-hidden="true" />
              Inscrever-se no Canal
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}