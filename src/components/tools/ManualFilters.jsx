import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Zap, RotateCcw } from "lucide-react";

export default function ManualFilters({ 
  brightness, 
  onBrightnessChange, 
  contrast, 
  onContrastChange, 
  saturation, 
  onSaturationChange, 
  onReset 
}) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Manual Adjustments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brightness: {brightness[0]}%
          </label>
          <Slider value={brightness} onValueChange={onBrightnessChange} min={50} max={150} step={1} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contrast: {contrast[0]}%
          </label>
          <Slider value={contrast} onValueChange={onContrastChange} min={50} max={150} step={1} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saturation: {saturation[0]}%
          </label>
          <Slider value={saturation} onValueChange={onSaturationChange} min={0} max={200} step={1} />
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </CardContent>
    </Card>
  );
}