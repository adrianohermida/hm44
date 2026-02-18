import React from "react";
import { Shrink, Zap, Maximize } from "lucide-react";

export default function CompressionSettings() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <div className="p-3 bg-red-50 rounded-lg">
        <Shrink className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <h4 className="font-medium text-red-800">High Compression</h4>
        <p className="text-xs text-red-600">Smaller file, lower quality</p>
      </div>
      <div className="p-3 bg-yellow-50 rounded-lg">
        <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
        <h4 className="font-medium text-yellow-800">Balanced</h4>
        <p className="text-xs text-yellow-600">Good size & quality</p>
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <Maximize className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <h4 className="font-medium text-green-800">High Quality</h4>
        <p className="text-xs text-green-600">Larger file, best quality</p>
      </div>
    </div>
  );
}