import React from 'react';
import TypeformOption from './TypeformOption';
import { STEP_OPTIONS } from './QualificationSteps';

export default function QualificationOptions({ stepId, selected, onChange }) {
  const options = STEP_OPTIONS[stepId];
  
  if (!options) return null;

  return (
    <>
      {options.map(opt => (
        <TypeformOption
          key={opt.value}
          label={opt.label}
          emoji={opt.emoji}
          selected={selected === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </>
  );
}