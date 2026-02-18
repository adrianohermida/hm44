import React from "react";
import { motion } from "framer-motion";
import SpeakerCard from "./SpeakerCard";

const speakers = [
  { name: "Dr. Rajesh Kumar", role: "CTO, Tech Giants Inc", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", topic: "Future of AI & Career Opportunities" },
  { name: "Priya Sharma", role: "Founder, StartupXYZ", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", topic: "From Student to Entrepreneur" },
  { name: "Amit Patel", role: "Senior Developer, FAANG", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", topic: "Cracking Tech Interviews" }
];

export default function SpeakerGrid() {
  return (
    <section className="mb-16">
      <h2 className="text-4xl font-bold text-[var(--brand-text-primary)] mb-8 text-center">Featured Speakers</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {speakers.map((speaker, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <SpeakerCard speaker={speaker} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}