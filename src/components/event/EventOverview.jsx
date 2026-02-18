import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Gift, CheckCircle } from "lucide-react";

const items = [
  { icon: CheckCircle, text: "Free Entry & Registration" },
  { icon: CheckCircle, text: "Complimentary Lunch & Snacks" },
  { icon: CheckCircle, text: "Workshop Materials & Kits" },
  { icon: CheckCircle, text: "Participation Certificate" }
];

export default function EventOverview() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="text-3xl">Event Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <Calendar className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Date & Time</h3>
              <p className="text-gray-600">15th March 2024</p>
              <p className="text-gray-600">9:00 AM - 6:00 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Venue</h3>
              <p className="text-gray-600">Convention Center</p>
              <p className="text-gray-600">Jhansi, Uttar Pradesh</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Users className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Capacity</h3>
              <p className="text-gray-600">500+ Students</p>
              <p className="text-red-600 font-semibold">Only 50 Spots Left!</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
            <Gift className="w-6 h-6 text-green-600" />
            What's Included (100% FREE)
          </h3>
          <ul className="grid md:grid-cols-2 gap-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-green-600" /> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}