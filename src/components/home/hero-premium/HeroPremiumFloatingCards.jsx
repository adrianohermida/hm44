import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function HeroPremiumFloatingCards() {
  const { data: gatilho } = useQuery({
    queryKey: ['gatilho-hero'],
    queryFn: async () => {
      const gatilhos = await base44.entities.GatilhoMarketing.filter({ 
        tipo_conteudo: 'hero', 
        status: 'ativo' 
      }, '-created_date', 1);
      return gatilhos[0] || null;
    },
    staleTime: 5 * 60 * 1000
  });

  const allStats = gatilho ? [
    { 
      icon: TrendingUp, 
      value: gatilho.estatistica_1_valor, 
      label: gatilho.estatistica_1_label,
      visivel: gatilho.estatistica_1_visivel,
      delay: 0.2 
    },
    { 
      icon: Users, 
      value: gatilho.estatistica_2_valor, 
      label: gatilho.estatistica_2_label,
      visivel: gatilho.estatistica_2_visivel,
      delay: 0.3 
    },
    { 
      icon: Shield, 
      value: gatilho.estatistica_3_valor, 
      label: gatilho.estatistica_3_label,
      visivel: gatilho.estatistica_3_visivel,
      delay: 0.4 
    },
    { 
      icon: Shield, 
      value: gatilho.estatistica_4_valor, 
      label: gatilho.estatistica_4_label,
      visivel: gatilho.estatistica_4_visivel,
      delay: 0.5 
    },
  ] : [
    { icon: TrendingUp, value: 'R$ 35M+', label: 'Renegociados', visivel: true, delay: 0.2 },
    { icon: Users, value: '5.000+', label: 'Clientes', visivel: true, delay: 0.4 },
    { icon: Shield, value: '12 anos', label: 'Experiência', visivel: true, delay: 0.6 },
  ];

  const floatingStats = allStats.filter(s => s.visivel && s.value && s.label);

  return (
    <div className="hidden xl:flex absolute top-1/2 -translate-y-1/2 right-8 flex-col gap-6 z-20">
      {floatingStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: stat.delay, duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
            className="bg-[var(--bg-elevated)] backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-[var(--border-primary)] min-w-[250px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[var(--brand-primary)]" />
              </div>
              <div>
                <p className="font-bold text-2xl text-[var(--text-primary)]">{stat.value}</p>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}