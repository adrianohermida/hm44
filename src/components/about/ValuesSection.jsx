import React from "react";
import { motion } from "framer-motion";
import { Shield, Scale, Heart } from "lucide-react";

const values = [
  { icon: Shield, title: "Proteção Total", description: "Atuação dedicada à defesa integral dos direitos do consumidor superendividado, com foco na aplicação da Lei 14.181/2021." },
  { icon: Scale, title: "Ética e Transparência", description: "Compromisso com a conduta profissional ilibada, prezando pela verdade processual e respeito às normas da OAB." },
  { icon: Heart, title: "Humanização do Direito", description: "Tratamento personalizado e empático, compreendendo que por trás de cada processo existe uma história de vida." }
];

export default function ValuesSection() {
  return (
    <section className="py-20 bg-[var(--navy-900)]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Nossos Valores</h2>
          <p className="text-xl text-gray-300">Os princípios que norteiam nossa advocacia</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[var(--brand-primary-100)] rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <value.icon className="w-8 h-8 text-[var(--brand-primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{value.title}</h3>
              <p className="text-gray-300">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}