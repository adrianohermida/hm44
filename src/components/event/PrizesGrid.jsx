import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

const prizes = [
  { rank: "1st Prize", amount: "₹5,00,000", desc: "Cash + Internship + Mentorship" },
  { rank: "2nd Prize", amount: "₹3,00,000", desc: "Cash + Internship" },
  { rank: "3rd Prize", amount: "₹2,00,000", desc: "Cash + Goodies" },
  { rank: "Participation", amount: "Certificates", desc: "All attendees get certificates" }
];

export default function PrizesGrid() {
  return (
    <section className="mb-16">
      <h2 className="text-4xl font-bold text-[var(--brand-text-primary)] mb-8 text-center">Competition Prizes</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {prizes.map((prize, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`text-center ${index === 0 ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400' : 'bg-white'}`}>
              <CardContent className="p-6">
                {index === 0 && <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />}
                {index === 1 && <Star className="w-10 h-10 text-gray-400 mx-auto mb-3" />}
                {index === 2 && <Star className="w-8 h-8 text-orange-600 mx-auto mb-3" />}
                <h3 className="font-bold text-xl mb-2">{prize.rank}</h3>
                <p className="text-2xl font-black text-purple-600 mb-2">{prize.amount}</p>
                <p className="text-sm text-gray-600">{prize.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}