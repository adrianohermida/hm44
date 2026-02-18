import React from "react";
import LinkSuggestionItem from "./LinkSuggestionItem";

export default function LinkSection({ title, links, tipo, onAplicar }) {
  if (!links || links.length === 0) return null;

  return (
    <div>
      <p className="font-semibold text-purple-900 mb-2 text-sm">{title}</p>
      <div className="space-y-2">
        {links.map((link, i) => (
          <LinkSuggestionItem 
            key={i} 
            link={link} 
            tipo={tipo}
            onAplicar={() => onAplicar(link, tipo)}
          />
        ))}
      </div>
    </div>
  );
}