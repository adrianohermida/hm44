import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shrink } from "lucide-react";

export default function PDFCompressor({ 
  onCompress, 
  onReset, 
  isProcessing, 
  compressionRatio, 
  onRatioChange, 
  fileSize 
}) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shrink className="w-5 h-5" />
          Compression Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Target Size: {compressionRatio}% of original
            </label>
            <span className="text-sm text-gray-500">~{formatFileSize(fileSize * (compressionRatio / 100))}</span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            value={compressionRatio}
            onChange={(e) => onRatioChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onCompress} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600">
            {isProcessing ? "Compressing..." : <><Shrink className="w-4 h-4 mr-2" />Compress PDF</>}
          </Button>
          <Button onClick={onReset} variant="outline">Reset</Button>
        </div>

        {isProcessing && <Progress value={33} className="w-full" />}
      </CardContent>
    </Card>
  );
}