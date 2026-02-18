import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ContentSearchBar({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 h-12 text-base"
      />
    </div>
  );
}