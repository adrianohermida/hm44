import React, { useState } from 'react';

export default function QualificationForm({ onSubmit }) {
  const [data, setData] = useState({ nome: '', email: '', telefone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nome completo"
        value={data.nome}
        onChange={(e) => setData({ ...data, nome: e.target.value })}
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      <input
        type="email"
        placeholder="E-mail"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      <input
        type="tel"
        placeholder="Telefone"
        value={data.telefone}
        onChange={(e) => setData({ ...data, telefone: e.target.value })}
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      <button
        type="submit"
        className="w-full bg-[var(--brand-primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--brand-primary-600)]"
      >
        Receber Proposta
      </button>
    </form>
  );
}