import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Mail, Phone } from 'lucide-react';
import { useClienteSearch } from '../cliente/hooks/useClienteSearch';

export default function ClienteAutocompleteEnhanced({ onSelect, onCreate, selectedCliente }) {
  const [busca, setBusca] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { data: clientes = [] } = useClienteSearch(busca);

  const handleSelect = (cliente) => {
    onSelect(cliente);
    setBusca('');
    setShowResults(false);
  };

  const handleClear = () => {
    onSelect(null);
    setBusca('');
  };

  if (selectedCliente) {
    return (
      <div className="border rounded-lg p-4 bg-green-50 border-green-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-[var(--text-primary)]">
                {selectedCliente.nome_completo || selectedCliente.razao_social}
              </h3>
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Mail className="w-3 h-3" />
                {selectedCliente.email_principal}
              </div>
              {selectedCliente.telefone_principal && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Phone className="w-3 h-3" />
                  {selectedCliente.telefone_principal}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 relative">
      <Input
        placeholder="Nome ou email do cliente..."
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setShowResults(e.target.value.length > 2);
        }}
        onFocus={() => busca.length > 2 && setShowResults(true)}
      />
      
      {showResults && (
        <div className="absolute z-50 w-full border rounded-lg max-h-72 overflow-y-auto bg-white shadow-lg">
          {clientes.length > 0 ? (
            <>
              {clientes.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className="w-full text-left p-3 hover:bg-blue-50 border-b transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">
                    {c.nome_completo || c.razao_social}
                  </div>
                  {(c.nome_completo && c.razao_social && c.nome_completo !== c.razao_social) && (
                    <div className="text-xs text-gray-700 uppercase">
                      {c.razao_social}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    ✓ {c.email_principal}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-4 text-sm text-gray-500">
              Nenhum cliente encontrado
            </div>
          )}
          
          {onCreate && (
            <Button 
              variant="ghost" 
              onClick={() => {
                onCreate();
                setShowResults(false);
              }} 
              className="w-full justify-start border-t hover:bg-blue-50" 
              type="button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar novo cliente
            </Button>
          )}
        </div>
      )}
    </div>
  );
}