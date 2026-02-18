import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Resume } from "@/entities/Resume";
import { ArrowLeft, Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import LivePreview from "@/components/templates/LivePreview";

const sampleData = {
  personal_info: {
    full_name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.com",
    summary: "Experienced software engineer with a passion for building scalable web applications and leading high-performing teams."
  },
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc",
      location: "San Francisco, CA",
      start_date: "2022-01",
      end_date: "",
      current: true,
      bullets: [
        "Led development of microservices architecture serving 1M+ daily users",
        "Improved application performance by 40% through code optimization",
        "Mentored 3 junior developers and established coding best practices"
      ]
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "Palo Alto, CA", 
      start_date: "2020-06",
      end_date: "2021-12",
      current: false,
      bullets: [
        "Built RESTful APIs using Node.js and Express.js",
        "Implemented responsive front-end interfaces with React",
        "Collaborated with cross-functional teams in Agile environment"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      graduation_year: "2020",
      gpa: "3.8/4.0"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "Git", "MongoDB"],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Full-stack web application with user authentication, payment processing, and admin dashboard",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      link: "github.com/johndoe/ecommerce"
    }
  ]
};

const templates = {
    modern: { name: "Modern Professional", accent: "#87D68D", bgColor: "#F7FFF6" },
    creative: { name: "Creative Portfolio", accent: "#FF6B6B", bgColor: "#FFF5F5" },
    executive: { name: "Executive Professional", accent: "#4A90E2", bgColor: "#F0F8FF" },
    minimal: { name: "Minimal Clean", accent: "#6B7280", bgColor: "#FAFAFA" },
    tech: { name: "Tech Innovator", accent: "#8B5CF6", bgColor: "#F5F3FF" },
    startup: { name: "Startup Founder", accent: "#EF4444", bgColor: "#FEF2F2" },
    healthcare: { name: "Healthcare Pro", accent: "#06B6D4", bgColor: "#ECFEFF" },
    academic: { name: "Academic Scholar", accent: "#7C3AED", bgColor: "#FAF5FF" }
  };

export default function TemplatePreview() {
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('template') || 'modern';
  
  const template = templates[templateId] || templates.modern;

  const createResumeWithTemplate = async () => {
    try {
      const newResume = await Resume.create({
        title: `My ${template.name} Resume`,
        template: templateId,
        personal_info: {
          full_name: "",
          email: "",
          phone: "",
          location: "",
          summary: ""
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        ats_score: 0
      });
      
      window.location.href = createPageUrl(`Editor?id=${newResume.id}`);
    } catch (error) {
      console.error("Error creating resume:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Link to={createPageUrl("Templates")}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600">Live preview with sample content</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              Download Sample
            </Button>
            <Button 
              onClick={createResumeWithTemplate}
              className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Use Template
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <LivePreview template={template} sampleData={sampleData} />

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Template Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.accent }}></div>
                  <span className="text-sm">Signature accent color</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>✓ ATS-friendly formatting</p>
                  <p>✓ Professional typography</p>
                  <p>✓ Clean, readable layout</p>
                  <p>✓ Optimized for printing</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customization Options</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• Change colors and fonts</p>
                <p>• Rearrange sections</p>
                <p>• Add or remove content blocks</p>
                <p>• Upload profile photo</p>
                <p>• AI-generated content suggestions</p>
              </CardContent>
            </Card>

            <Button 
              onClick={createResumeWithTemplate}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-4"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Building Your Resume
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}