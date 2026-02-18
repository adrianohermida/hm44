import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BookingSuccessView({ selectedDate, selectedSlot, theme }) {
  return (
    <div className={`min-h-screen py-20 ${theme === 'dark' ? 'bg-[#0a0f0d]' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="w-24 h-24 bg-[#0d9c6e]/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-[#0d9c6e]" size={48} />
          </div>
          <h1 className={`text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Solicitação Recebida!
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Obrigado por confiar na Hermida Maia Advocacia. Sua solicitação para o dia{' '}
            <strong>{new Date(selectedDate).toLocaleDateString('pt-BR')}</strong> às{' '}
            <strong>{selectedSlot}</strong> foi enviada.
          </p>
          <div className="flex justify-center my-6">
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm px-4 py-2">
              Aguardando Aceite
            </Badge>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Você receberá uma confirmação por e-mail assim que o profissional validar o horário.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Home')}>
              <Button size="lg" className="bg-[#0d9c6e] hover:bg-[#0a7d58] w-full sm:w-auto font-semibold shadow-lg">
                Voltar para o Início
              </Button>
            </Link>
            <a href="https://wa.me/5551996032004" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                variant="outline" 
                className={`w-full sm:w-auto font-semibold ${
                  theme === 'dark'
                    ? 'border-white/10 text-white hover:bg-white/5'
                    : 'border-gray-300 text-gray-900 hover:bg-gray-100'
                }`}
              >
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}