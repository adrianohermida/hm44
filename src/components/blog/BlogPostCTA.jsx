import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BlogPostCTA() {
  return (
    <div className="mt-12 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-600)] rounded-2xl p-8 text-center shadow-xl">
      <h3 className="text-2xl font-bold mb-2 text-white">Precisa de ajuda jurídica?</h3>
      <p className="mb-6 text-white">Entre em contato e converse com nosso time especializado</p>
      <Link to={createPageUrl("Contact")}>
        <button className="bg-white text-[var(--brand-primary)] font-bold px-8 py-3 rounded-full hover:shadow-lg transition-shadow">
          Falar com Especialista
        </button>
      </Link>
    </div>
  );
}