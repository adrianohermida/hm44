import React from "react";

export default function TemaMotivo({ motivo }) {
  if (!motivo) return null;

  return (
    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
      💡 {motivo}
    </p>
  );
}