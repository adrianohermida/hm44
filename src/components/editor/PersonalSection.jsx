import React, { useState } from "react";
import { UploadFile } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Upload, X } from "lucide-react";

export default function PersonalSection({ data, onChange }) {
  const [isUploading, setIsUploading] = useState(false);

  const updateField = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await UploadFile({ file });
      updateField('profile_photo', response.file_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsUploading(false);
  };

  const removePhoto = () => {
    updateField('profile_photo', '');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo Upload */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            {data.profile_photo ? (
              <div className="relative">
                <img 
                  src={data.profile_photo} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-200"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <Label>Profile Photo (Optional)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
                disabled={isUploading}
              />
              {isUploading && (
                <Button disabled size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a professional headshot (JPG, PNG - Max 5MB)
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={data.full_name || ""}
              onChange={(e) => updateField('full_name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location || ""}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={data.linkedin || ""}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div>
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={data.website || ""}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="johndoe.com"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={data.summary || ""}
            onChange={(e) => updateField('summary', e.target.value)}
            placeholder="A brief professional summary highlighting your key strengths, achievements, and career objectives. Focus on what makes you unique as a candidate and your value proposition to employers."
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            Tip: Keep it concise (2-3 sentences) and focus on your most relevant qualifications
          </p>
        </div>
      </CardContent>
    </Card>
  );
}