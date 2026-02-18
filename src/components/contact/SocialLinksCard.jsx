import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Instagram, Youtube, Facebook } from "lucide-react";

const socials = [
  { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/in/adrianohermidamaia" },
  { icon: Instagram, label: "Instagram", url: "https://instagram.com/hermidamaia.adv" },
  { icon: Youtube, label: "YouTube", url: "https://youtube.com/@hermidamaia" },
  { icon: Facebook, label: "Facebook", url: "https://facebook.com/hermidamaia.adv" }
];

export default function SocialLinksCard() {
  return (
    <Card className="bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
      <CardContent className="p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Siga-nos nas Redes</h3>
        <div className="grid grid-cols-2 gap-3">
          {socials.map((social, i) => {
            const Icon = social.icon;
            return (
              <Button
                key={i}
                variant="outline"
                size="sm"
                asChild
                className="border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]"
              >
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  <Icon className="w-4 h-4 mr-2" />
                  {social.label}
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}