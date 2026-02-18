import React from "react";
import { FileCheck } from "lucide-react";

export default function RevisaoHeader({ total }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <FileCheck className="w-5 h-5 text-blue-600" aria-hidden="true" />
      <div>
        <h3 className="font-bold text-base sm:text-lg">Artigos em Revisão</h3>
        <p className="text-xs sm:text-sm text-gray-600">
          {total} artigo(s) aguardando revisão
        </p>
      </div>
    </div>
  );
}