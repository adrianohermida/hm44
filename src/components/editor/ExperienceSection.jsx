import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Briefcase, Plus, X } from "lucide-react";

export default function ExperienceSection({ data, onChange }) {
  const addExperience = () => {
    const newExperience = {
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      current: false,
      bullets: [""]
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = data.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  const addBullet = (expIndex) => {
    const updated = data.map((exp, i) => 
      i === expIndex ? { ...exp, bullets: [...exp.bullets, ""] } : exp
    );
    onChange(updated);
  };

  const updateBullet = (expIndex, bulletIndex, value) => {
    const updated = data.map((exp, i) => {
      if (i === expIndex) {
        const newBullets = [...exp.bullets];
        newBullets[bulletIndex] = value;
        return { ...exp, bullets: newBullets };
      }
      return exp;
    });
    onChange(updated);
  };

  const removeBullet = (expIndex, bulletIndex) => {
    const updated = data.map((exp, i) => {
      if (i === expIndex) {
        return { ...exp, bullets: exp.bullets.filter((_, bi) => bi !== bulletIndex) };
      }
      return exp;
    });
    onChange(updated);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200/30">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Briefcase className="w-5 h-5" />
            Work Experience
          </CardTitle>
          <Button onClick={addExperience} size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No experience added yet. Click "Add Experience" to get started.</p>
          </div>
        ) : (
          data.map((experience, expIndex) => (
            <div key={expIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">Experience {expIndex + 1}</h3>
                <Button 
                  onClick={() => removeExperience(expIndex)} 
                  size="sm" 
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={experience.title || ""}
                    onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={experience.company || ""}
                    onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                    placeholder="Tech Company Inc."
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={experience.location || ""}
                    onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={experience.start_date || ""}
                    onChange={(e) => updateExperience(expIndex, 'start_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={experience.end_date || ""}
                    onChange={(e) => updateExperience(expIndex, 'end_date', e.target.value)}
                    disabled={experience.current}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${expIndex}`}
                  checked={experience.current || false}
                  onChange={(e) => updateExperience(expIndex, 'current', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`current-${expIndex}`}>I currently work here</Label>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Key Achievements</Label>
                  <Button 
                    onClick={() => addBullet(expIndex)} 
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Bullet
                  </Button>
                </div>
                <div className="space-y-2">
                  {(experience.bullets || []).map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-2">
                      <Textarea
                        value={bullet}
                        onChange={(e) => updateBullet(expIndex, bulletIndex, e.target.value)}
                        placeholder="• Achieved 30% increase in team productivity by implementing new processes..."
                        rows={2}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeBullet(expIndex, bulletIndex)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50 h-auto"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}