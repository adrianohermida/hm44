import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  { q: "Is the event really free?", a: "Yes! 100% free entry, including lunch and all workshop materials." },
  { q: "Who can attend?", a: "All students from any college/university are welcome, regardless of branch or year." },
  { q: "What should I bring?", a: "Just bring your laptop, enthusiasm, and a learning mindset!" },
  { q: "Will I get a certificate?", a: "Yes, all attendees will receive a participation certificate." }
];

export default function FAQAccordion() {
  return (
    <section className="mb-16">
      <h2 className="text-4xl font-bold text-[var(--brand-text-primary)] mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-[var(--brand-text-primary)] mb-2">{faq.q}</h3>
                <p className="text-[var(--brand-text-secondary)]">{faq.a}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}