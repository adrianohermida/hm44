import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SpeakerList({ speakers }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {speakers.map((speaker, index) => (
        <Card key={index} className="text-center">
          <CardContent className="p-6">
            {speaker.foto && (
              <img
                src={speaker.foto}
                alt={speaker.nome}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[var(--brand-primary-100)]"
              />
            )}
            <h3 className="font-bold text-[var(--text-primary)] mb-1">
              {speaker.nome}
            </h3>
            <p className="text-sm text-[var(--brand-primary)] font-medium mb-2">
              {speaker.cargo}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              {speaker.bio}
            </p>
            {(speaker.linkedin || speaker.twitter) && (
              <div className="flex justify-center gap-3">
                {speaker.linkedin && (
                  <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5 text-[var(--brand-info)]" />
                  </a>
                )}
                {speaker.twitter && (
                  <a href={speaker.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5 text-[var(--brand-info)]" />
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}