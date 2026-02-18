import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TestimonialCardEnhanced from './TestimonialCardEnhanced';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestimonialSectionEnhanced() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [googleReviews, setGoogleReviews] = useState([]);
  const [carregandoGoogle, setCarregandoGoogle] = useState(true);

  const { data: depoimentos = [], isLoading } = useQuery({
    queryKey: ['depoimentos', 'aprovados'],
    queryFn: () => base44.entities.Depoimento.filter({ status: 'aprovado' }, '-data_depoimento'),
  });

  useEffect(() => {
    const carregarGoogleReviews = async () => {
      try {
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `Acesse a página do Google Meu Negócio no link: https://www.google.com/maps/place/Adriano+Hermida+Maia+-+Advogado/@-23.5729542,-46.7181134,17z/data=!4m8!3m7!1s0x94ce5728e471b4ad:0x7fa5f4d52771c390!8m2!3d-23.5729542!4d-46.7155385!9m1!1b1!16s%2Fg%2F11kps_y76z
          
          Extraia TODOS os comentários/avaliações reais e verificados que aparecem nesta página do Google. Retorne APENAS avaliações com 4 ou 5 estrelas (positivas).
          
          Para cada comentário real encontrado, forneça:
          - Nome exato do autor conforme aparece no Google
          - Texto completo do comentário (exatamente como está escrito)
          - Rating (número de estrelas)
          - Data relativa ou absoluta do comentário
          
          IMPORTANTE: Extraia os comentários REAIS da página, não invente ou crie exemplos fictícios. Se não encontrar comentários, retorne um array vazio.`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              reviews: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    author_name: { type: "string" },
                    rating: { type: "number" },
                    text: { type: "string" },
                    relative_time: { type: "string" }
                  },
                  required: ["author_name", "rating", "text"]
                }
              }
            }
          }
        });
        setGoogleReviews(response.reviews || []);
      } catch (error) {
        console.error('Erro ao carregar reviews do Google:', error);
      }
      setCarregandoGoogle(false);
    };
    carregarGoogleReviews();
  }, []);

  const todosDepoimentos = [
    ...depoimentos.map(d => ({ ...d, source: 'database' })),
    ...googleReviews.map(r => ({
      id: `google-${r.author_name}`,
      nome_cliente: r.author_name,
      depoimento: r.text,
      avaliacao: r.rating,
      data_depoimento: r.relative_time || 'Recente',
      verificado: true,
      source: 'google',
      destaque: false
    }))
  ];

  useEffect(() => {
    if (todosDepoimentos.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % todosDepoimentos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [todosDepoimentos.length]);

  const getVisibleTestimonials = () => {
    if (todosDepoimentos.length === 0) return [];
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(todosDepoimentos[(currentIndex + i) % todosDepoimentos.length]);
    }
    return visible;
  };

  if (!isLoading && !carregandoGoogle && todosDepoimentos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[var(--bg-secondary)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4" fill="currentColor" />
            Depoimentos Verificados
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-3">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Avaliações reais de clientes que recuperaram sua liberdade financeira
          </p>
        </div>

        {isLoading || carregandoGoogle ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--bg-elevated)] rounded-2xl p-6 animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <motion.div 
              className="grid md:grid-cols-3 gap-6"
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {getVisibleTestimonials().map((dep, index) => (
                <div key={`${dep.id}-${index}`}>
                  <TestimonialCardEnhanced depoimento={dep} />
                </div>
              ))}
            </motion.div>
            
            <div className="flex justify-center gap-2 mt-8">
              {todosDepoimentos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-[var(--brand-primary)] w-8' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}