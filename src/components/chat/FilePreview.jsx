import React from "react";
import { Paperclip, Image as ImageIcon, X } from "lucide-react";

export default function FilePreview({ files, onRemove }) {
  if (!files || files.length === 0) return null;

  return (
    <div className="mb-3 flex gap-2 flex-wrap">
      {files.map((file, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs border bg-green-50 border-[#079a68]"
        >
          {file.type.startsWith('image/') ? (
            <ImageIcon className="w-4 h-4 text-[#079a68]" />
          ) : (
            <Paperclip className="w-4 h-4 text-[#079a68]" />
          )}
          <span className="max-w-[120px] truncate text-[#067d54]">{file.name}</span>
          <button onClick={() => onRemove(idx)} className="text-[#079a68]">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}