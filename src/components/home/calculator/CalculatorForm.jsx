import React from 'react';
import CalculatorInput from './CalculatorInput';
import CalculatorButton from './CalculatorButton';
import CalculatorProgress from './CalculatorProgress';

export default function CalculatorForm({ data, onChange, onSubmit, currentStep = 3, loading = false }) {
  const isFormValid = data.totalDividas && data.parcelasMensais && data.rendaLiquida;

  return (
    <div className="space-y-6 sm:space-y-8">
      <CalculatorProgress currentStep={currentStep} totalSteps={3} />
      
      <div className="space-y-5 sm:space-y-6">
        <CalculatorInput
          label="Valor total das dívidas"
          value={data.totalDividas}
          onChange={(e) => onChange({...data, totalDividas: e.target.value})}
          example="R$ 15.000"
          placeholder="R$ 15.000"
        />

        <CalculatorInput
          label="Parcelas mensais"
          value={data.parcelasMensais}
          onChange={(e) => onChange({...data, parcelasMensais: e.target.value})}
          example="R$ 2.500"
          placeholder="R$ 2.500"
          helperText="Soma de cartões, empréstimos e parcelamentos (exceto garantia de bens, impostos, pensão)"
        />

        <CalculatorInput
          label="Renda líquida familiar"
          value={data.rendaLiquida}
          onChange={(e) => onChange({...data, rendaLiquida: e.target.value})}
          example="R$ 5.000"
          placeholder="R$ 5.000"
          helperText="Salário bruto menos impostos"
        />
      </div>

      <CalculatorButton 
        onClick={onSubmit} 
        loading={loading}
        disabled={!isFormValid}
      >
        Calcular Minha Situação
      </CalculatorButton>
    </div>
  );
}