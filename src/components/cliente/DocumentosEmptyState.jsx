import React from "react";
import { FileText } from "lucide-react";

export default function DocumentosEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-[var(--text-secondary)]" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] italic">
        Nenhum documento enviado ainda.
      </p>
    </div>
  );
}