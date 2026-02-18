import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock } from "lucide-react";

const workshops = [
  { title: "Web Development Bootcamp", duration: "2 hours", level: "Beginner to Advanced" },
  { title: "AI & Machine Learning Workshop", duration: "2 hours", level: "Intermediate" },
  { title: "Design Thinking Session", duration: "1.5 hours", level: "All Levels" },
  { title: "Resume Building & Interview Prep", duration: "1 hour", level: "All Levels" }
];

export default function WorkshopsList() {
  return (
    <section className="mb-16">
      <h2 className="text-4xl font-bold text-[var(--brand-text-primary)] mb-8 text-center">Workshop Sessions</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {workshops.map((workshop, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-[var(--brand-info)] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-[var(--brand-text-primary)] mb-2">{workshop.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-[var(--brand-text-secondary)]">
                        <Clock className="w-4 h-4" /> {workshop.duration}
                      </span>
                      <Badge variant="outline">{workshop.level}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}