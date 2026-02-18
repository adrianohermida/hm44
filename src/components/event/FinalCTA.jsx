import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function FinalCTA({ onRegister }) {
  return (
    <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
      <CardContent className="p-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Join?</h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Don't miss this opportunity to learn, network, and win amazing prizes!
        </p>
        <Button 
          onClick={onRegister}
          size="lg"
          className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold"
        >
          <Sparkles className="w-6 h-6 mr-2" />
          Register Now - It's FREE!
        </Button>
        <p className="text-white/80 mt-4">Limited spots available • Register before it's too late!</p>
      </CardContent>
    </Card>
  );
}