import React from 'react';
import { Star, Play, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function TestimonialCardEnhanced({ depoimento }) {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < depoimento.avaliacao ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--border-secondary)]'
        }`}
      />
    ));
  };

  return (
    <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-[var(--border-primary)]">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={depoimento.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(depoimento.nome_cliente)}
          alt={depoimento.nome_cliente}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-[var(--text-primary)]">{depoimento.nome_cliente}</h4>
            {depoimento.verificado && (
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)]" />
            )}
          </div>
          {depoimento.profissao && (
            <p className="text-sm text-[var(--text-secondary)]">{depoimento.profissao}</p>
          )}
          {depoimento.cidade && (
            <p className="text-xs text-[var(--text-tertiary)]">{depoimento.cidade}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5 mb-3">
        {renderStars()}
      </div>

      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
        {depoimento.depoimento}
      </p>

      {depoimento.video_url && (
        <a
          href={depoimento.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] font-semibold mb-4"
        >
          <Play className="w-4 h-4" />
          Ver depoimento em vídeo
        </a>
      )}

      {depoimento.desconto_percentual && (
        <div className="bg-[var(--brand-success)]/10 border border-[var(--brand-success)]/30 rounded-lg p-3 mb-3">
          <p className="text-sm font-semibold text-[var(--brand-success)]">
            {depoimento.desconto_percentual}% de desconto
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            De R$ {depoimento.valor_divida?.toLocaleString('pt-BR')} para R$ {depoimento.valor_acordo?.toLocaleString('pt-BR')}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-[var(--text-tertiary)]">
          {depoimento.source === 'google' 
            ? depoimento.data_depoimento 
            : format(new Date(depoimento.data_depoimento), "dd/MM/yyyy")}
        </p>
        {depoimento.source === 'google' && (
          <span className="text-xs bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-2 py-1 rounded-full font-semibold">
            Google
          </span>
        )}
      </div>
    </div>
  );
}