import { useState } from 'react';

export function useCalculator() {
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const val = parseFloat(valor);
    if (isNaN(val) || val <= 0) return;

    const desconto = val * 0.7;
    const parcelas = Math.ceil(desconto / 12);

    setResultado({
      valorOriginal: val,
      desconto,
      parcelas
    });
  };

  const reset = () => {
    setValor('');
    setResultado(null);
  };

  return { valor, setValor, resultado, calcular, reset };
}