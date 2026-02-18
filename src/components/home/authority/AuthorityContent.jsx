import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function AuthorityContent() {
  return (
    <div className="order-1 lg:order-2 text-white space-y-6">
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-3">Dr. Adriano Hermida Maia</h3>
        <p className="text-[var(--brand-primary)] text-lg font-semibold mb-4">
          Advogado e Sócio do Escritório Hermida Maia
        </p>
      </div>

      <p className="text-gray-300 leading-relaxed">
        <strong>Docente</strong>, especialista em Crimes Digitais, Pós-Graduado em Processo Civil, Direito do Trabalho e Processo do Trabalho, MBA em Contabilidade & Direito Tributário com ênfase em risco fiscal.
      </p>
      
      <p className="text-gray-300 leading-relaxed">
        Autor do livro <strong className="text-[var(--brand-primary)]">Manual do Superendividado</strong>, dedica-se a ajudar superendividados a renegociar suas dívidas e recuperar a saúde financeira.
      </p>

      <Link to={createPageUrl("About")}>
        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900">
          Conheça Mais Sobre o Dr. Adriano <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}