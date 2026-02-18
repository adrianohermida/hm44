import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const ENCODINGS = [
  { value: 'utf-8', label: 'UTF-8 (Padrão)' },
  { value: 'latin1', label: 'Latin-1 (ISO-8859-1)' },
  { value: 'windows-1252', label: 'Windows-1252' },
];

const DELIMITERS = [
  { value: ',', label: 'Vírgula (,)' },
  { value: ';', label: 'Ponto e Vírgula (;)' },
  { value: '\t', label: 'Tab' },
];

export default function EncodingDetector({ encoding, delimiter, onEncodingChange, onDelimiterChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label className="text-xs">Encoding</Label>
        <Select value={encoding} onValueChange={onEncodingChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ENCODINGS.map(e => (
              <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Delimitador</Label>
        <Select value={delimiter} onValueChange={onDelimiterChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DELIMITERS.map(d => (
              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}