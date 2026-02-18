import React, { useState } from 'react';
import CalculatorForm from './calculator/CalculatorForm';
import CalculatorResult from './calculator/CalculatorResult';

export default function CalculatorSection() {
  const [data, setData] = useState({ totalDividas: '', parcelasMensais: '', rendaLiquida: '' });
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const calcular = () => {
    const dividas = parseFloat(data.totalDividas);
    const parcelas = parseFloat(data.parcelasMensais);
    const renda = parseFloat(data.rendaLiquida);
    if (isNaN(dividas) || isNaN(parcelas) || isNaN(renda)) return;
    
    setLoading(true);
    setTimeout(() => {
      const comprometimento = (parcelas / renda) * 100;
      setResultado({ comprometimento, superendividado: comprometimento > 30, dividas, parcelas, renda });
      setLoading(false);
    }, 800);
  };

  return (
    <section id="calculadora-section" className="py-12 sm:py-16 md:py-20 bg-[var(--bg-secondary)] px-4" aria-labelledby="calculator-heading">
      <div className="max-w-4xl mx-auto">
        <h2 id="calculator-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3 text-center">
          Calculadora de Superendividamento
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] mb-6 sm:mb-8 text-center px-4">
          Descubra em minutos se você tem direito à Lei do Superendividamento
        </p>

        <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-[var(--border-primary)]">
          {!resultado ? (
            <CalculatorForm data={data} onChange={setData} onSubmit={calcular} loading={loading} />
          ) : (
            <CalculatorResult resultado={resultado} onReset={() => { setResultado(null); setLoading(false); }} />
          )}
        </div>
      </div>
    </section>
  );
}