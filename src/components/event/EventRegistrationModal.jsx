import React, { useState } from "react";
import { StudentEvent } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventRegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    field_of_study: "",
    event_interest: [],
    referral_code: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const interests = [
    "Web Development",
    "Mobile Apps",
    "AI & Machine Learning",
    "Data Science",
    "Career Guidance",
    "Entrepreneurship",
    "Design & UI/UX",
    "Marketing"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      event_interest: prev.event_interest.includes(interest)
        ? prev.event_interest.filter(i => i !== interest)
        : [...prev.event_interest, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await StudentEvent.create({
        ...formData,
        registration_date: new Date().toISOString(),
        status: "registered"
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          college: "",
          year: "",
          field_of_study: "",
          event_interest: [],
          referral_code: ""
        });
      }, 3000);
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/30"
        >
          {isSuccess ? (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">Registration Successful! 🎉</h2>
              <p className="text-gray-300 text-lg mb-2">
                Welcome to the Mega Student Summit 2024!
              </p>
              <p className="text-gray-400">
                Check your email for confirmation and event details.
              </p>
            </div>
          ) : (
            <>
              <div className="relative p-8 border-b border-white/10">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-3xl font-bold text-white">Event Registration</h2>
                </div>
                <p className="text-gray-300">Fill in your details to secure your free spot!</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name" className="text-white mb-2">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="John Doe"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white mb-2">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white mb-2">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="college" className="text-white mb-2">College/University *</Label>
                    <Input
                      id="college"
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      placeholder="Your College Name"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="year" className="text-white mb-2">Current Year *</Label>
                    <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="field_of_study" className="text-white mb-2">Field of Study</Label>
                    <Input
                      id="field_of_study"
                      value={formData.field_of_study}
                      onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                      placeholder="Computer Science, Engineering, etc."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-3 block">Areas of Interest</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          formData.event_interest.includes(interest)
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="referral_code" className="text-white mb-2">Referral Code (Optional)</Label>
                  <Input
                    id="referral_code"
                    value={formData.referral_code}
                    onChange={(e) => handleInputChange('referral_code', e.target.value)}
                    placeholder="Enter code if you have one"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg font-bold rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Complete Registration
                    </>
                  )}
                </Button>

                <p className="text-center text-gray-400 text-sm">
                  By registering, you agree to receive event updates via email and WhatsApp.
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}