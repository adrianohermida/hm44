import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Palette } from "lucide-react";

export default function AIEnhancer({ onEnhance, onBackground, isProcessing }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Enhancement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={onEnhance}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
            disabled={isProcessing}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isProcessing ? "Enhancing..." : "AI Auto-Enhance"}
          </Button>
          
          <Button 
            onClick={onBackground}
            variant="outline"
            className="w-full"
            disabled={isProcessing}
          >
            <Palette className="w-4 h-4 mr-2" />
            Generate Professional Background
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}