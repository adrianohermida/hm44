import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin } from "lucide-react";

export default function PersonalInfoForm({ formData, onInputChange }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-[var(--brand-primary-50)]">
      <CardHeader>
        <CardTitle className="text-[var(--brand-text-primary)]">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-[var(--brand-text-primary)]">Full Name</Label>
            <Input
              id="fullName"
              value={formData.full_name}
              onChange={(e) => onInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-[var(--brand-text-primary)]">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-[var(--brand-bg-secondary)] mt-1"
            />
            <p className="text-xs text-[var(--brand-text-tertiary)] mt-1">Email cannot be changed</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="text-[var(--brand-text-primary)]">Phone Number</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-[var(--brand-text-tertiary)]" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location" className="text-[var(--brand-text-primary)]">Location</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-[var(--brand-text-tertiary)]" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => onInputChange('location', e.target.value)}
                placeholder="City, State/Country"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="bio" className="text-[var(--brand-text-primary)]">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your interests, and your professional background..."
            rows={4}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}