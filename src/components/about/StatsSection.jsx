import React from "react";
import { motion } from "framer-motion";
import { Award, Target, TrendingUp, Sparkles } from "lucide-react";

const stats = [
  { number: "2.000+", label: "Planos Homologados", icon: Award },
  { number: "98%", label: "Taxa de Sucesso", icon: Target },
  { number: "R$ 35M+", label: "Dívidas Renegociadas", icon: TrendingUp },
  { number: "10+", label: "Anos de Experiência", icon: Sparkles }
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-[var(--bg-elevated)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[var(--brand-primary-100)] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-[var(--brand-primary)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">{stat.number}</div>
              <div className="text-[var(--text-secondary)]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}