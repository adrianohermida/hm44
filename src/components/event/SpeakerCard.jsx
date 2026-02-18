import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SpeakerCard({ speaker }) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 border-purple-200">
      <CardContent className="p-6 text-center">
        <img 
          src={speaker.image} 
          alt={speaker.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-purple-200"
        />
        <h3 className="text-xl font-bold text-[var(--brand-text-primary)] mb-1">{speaker.name}</h3>
        <p className="text-purple-600 font-semibold mb-3">{speaker.role}</p>
        <Badge className="bg-blue-100 text-blue-800">{speaker.topic}</Badge>
      </CardContent>
    </Card>
  );
}