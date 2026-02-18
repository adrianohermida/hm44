import React from "react";
import { Resume } from "@/entities/Resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Eye, Download, Plus, Star, Palette, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean, contemporary design with subtle colors and clear typography",
    accent: "#10B981",
    bgColor: "#F0FDF4",
    features: ["ATS Optimized", "Clean Layout", "Professional"],
    category: "professional",
    popular: true,
  },
  {
    id: "creative", 
    name: "Creative Portfolio",
    description: "Vibrant design perfect for creative professionals and designers",
    accent: "#F59E0B",
    bgColor: "#FFFBEB",
    features: ["Eye-catching", "Creative", "Portfolio Focus"],
    category: "creative",
    popular: false,
  },
  {
    id: "executive",
    name: "Executive Professional", 
    description: "Traditional, formal design ideal for senior positions",
    accent: "#3B82F6",
    bgColor: "#EFF6FF",
    features: ["Traditional", "Formal", "Executive"],
    category: "executive",
    popular: false,
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Ultra-clean design focusing on content with maximum readability",
    accent: "#6B7280",
    bgColor: "#F9FAFB",
    features: ["Minimal", "Clean", "Readable"],
    category: "minimal",
    popular: false,
  },
  {
    id: "tech",
    name: "Tech Innovator",
    description: "Modern tech-focused design with coding elements and dark theme",
    accent: "#8B5CF6",
    bgColor: "#F5F3FF",
    features: ["Tech Style", "Dark Theme", "Code Elements"],
    category: "tech",
    popular: true,
  },
  {
    id: "startup",
    name: "Startup Founder",
    description: "Bold entrepreneurial design for startup founders and innovators",
    accent: "#EF4444",
    bgColor: "#FEF2F2",
    features: ["Bold", "Entrepreneurial", "Modern"],
    category: "startup",
    popular: false,
  },
  {
    id: "healthcare",
    name: "Healthcare Pro",
    description: "Clean medical professional design with trust-building elements",
    accent: "#06B6D4",
    bgColor: "#ECFEFF",
    features: ["Medical", "Trust-building", "Professional"],
    category: "healthcare",
    popular: false,
  },
  {
    id: "academic",
    name: "Academic Scholar",
    description: "Scholarly design perfect for researchers and academics",
    accent: "#7C3AED",
    bgColor: "#FAF5FF",
    features: ["Academic", "Research Focus", "Publications"],
    category: "academic",
    popular: false,
  }
];

const categories = [
  { id: "all", label: "All Templates", icon: Sparkles },
  { id: "professional", label: "Professional", icon: Zap },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "tech", label: "Technology", icon: Star }
];

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const createResumeWithTemplate = async (templateId) => {
    try {
      const template = templates.find(t => t.id === templateId);
      const newResume = await Resume.create({
        title: `My ${template?.name} Resume`,
        template: templateId,
        personal_info: {
          full_name: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
          profile_photo: ""
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

  const filteredTemplates = templates.filter(template => 
    selectedCategory === "all" || template.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Resume Templates</h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Choose from our collection of professionally designed, ATS-optimized resume templates
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`${selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50'}`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200 relative overflow-hidden">
                {template.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-2 p-3 sm:p-4">
                  {/* Template Preview */}
                  <div className="h-40 sm:h-48 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 mb-3 sm:mb-4 relative">
                    <div 
                      className="w-full h-full p-3 sm:p-4 rounded-md shadow-lg"
                      style={{ backgroundColor: template.bgColor }}
                    >
                      <div className="text-center font-bold text-gray-700 text-xs sm:text-sm mb-2">{template.name}</div>
                      <div className="w-1/2 h-0.5 sm:h-1 mx-auto rounded-full mb-2 sm:mb-3" style={{ backgroundColor: template.accent }}></div>
                      <div className="space-y-1 sm:space-y-2">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-1 sm:h-1.5 rounded-full" style={{ 
                            width: `${Math.random() * 40 + 60}%`, 
                            backgroundColor: template.accent, 
                            opacity: 0.4 + (i * 0.1) 
                          }}></div>
                        ))}
                      </div>
                      <div className="mt-2 sm:mt-3">
                        <div className="h-0.5 sm:h-1 w-full bg-gray-200 rounded mb-1"></div>
                        <div className="flex gap-1">
                          <div className="h-0.5 sm:h-1 w-1/3 rounded" style={{ backgroundColor: template.accent, opacity: 0.6 }}></div>
                          <div className="h-0.5 sm:h-1 w-1/4 rounded" style={{ backgroundColor: template.accent, opacity: 0.5 }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                    {template.name}
                  </CardTitle>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">
                    {template.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0 p-3 sm:p-4 flex flex-col h-full justify-end">
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-6">
                    {template.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex}
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: template.accent, color: template.accent }}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link to={createPageUrl(`TemplatePreview?template=${template.id}`)} className="flex-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full group-hover:bg-blue-50 group-hover:border-blue-200"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                    <Button 
                      size="sm"
                      onClick={() => createResumeWithTemplate(template.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs sm:text-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Professional Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link to={createPageUrl("PhotoEditor")}>
              <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-200 group cursor-pointer">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Photo Editor</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Make your profile photo professional with AI enhancement</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("PDFTools")}>
              <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-200 group cursor-pointer">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Download className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">PDF Tools</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Resize and optimize your resume PDFs for applications</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Templates")} className="sm:col-span-2 lg:col-span-1">
              <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-200 group cursor-pointer">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">AI Assistant</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Get AI suggestions to improve your resume content</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Why Our Templates?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {[
              { title: "ATS Optimized", desc: "Pass applicant tracking systems", icon: "🎯" },
              { title: "Professional Design", desc: "Crafted by design experts", icon: "✨" },
              { title: "Easy Customization", desc: "Modify colors, fonts, and layout", icon: "🎨" },
              { title: "Multiple Formats", desc: "Export to PDF, DOCX, and more", icon: "📄" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}