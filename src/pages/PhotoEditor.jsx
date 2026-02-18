import React, { useState, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, User } from "lucide-react";
import { motion } from "framer-motion";
import ResumeLoader from "@/components/common/ResumeLoader";
import PhotoUploader from "@/components/tools/PhotoUploader";
import AIEnhancer from "@/components/tools/AIEnhancer";
import ManualFilters from "@/components/tools/ManualFilters";

export default function PhotoEditor() {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      setImage(response.file_url);
      setEditedImage(response.file_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsProcessing(false);
  };

  const enhanceWithAI = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this professional headshot photo and provide recommendations for making it more professional for a resume. Consider lighting, background, composition, and overall professional appearance. Provide specific adjustment recommendations.`,
        file_urls: [image],
        response_json_schema: {
          type: "object",
          properties: {
            professional_score: { type: "number", minimum: 0, maximum: 100 },
            recommendations: { type: "array", items: { type: "string" } },
            brightness_adjustment: { type: "number", minimum: 80, maximum: 120 },
            contrast_adjustment: { type: "number", minimum: 80, maximum: 120 },
            background_suggestion: { type: "string" }
          }
        }
      });

      if (response.brightness_adjustment) {
        setBrightness([response.brightness_adjustment]);
      }
      if (response.contrast_adjustment) {
        setContrast([response.contrast_adjustment]);
      }
      
      // Apply the AI recommendations
      applyFilters(response.brightness_adjustment || 100, response.contrast_adjustment || 100, saturation[0]);
      
    } catch (error) {
      console.error("Error enhancing image:", error);
    }
    setIsProcessing(false);
  };

  const applyFilters = useCallback((bright, cont, sat) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.filter = `brightness(${bright}%) contrast(${cont}%) saturate(${sat}%)`;
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      setEditedImage(dataURL);
    };
    
    img.crossOrigin = "anonymous";
    img.src = image;
  }, [image, canvasRef]); // Added canvasRef to dependencies

  const generateProfessionalBackground = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    try {
      const response = await base44.integrations.Core.GenerateImage({
        prompt: "Professional neutral background for business headshot, soft gradient, clean corporate style, suitable for resume photo, high quality, professional lighting"
      });
      
      // Here you would composite the person onto the new background
      // This would require more complex image processing
      console.log("Generated background:", response.url);
      
    } catch (error) {
      console.error("Error generating background:", error);
    }
    setIsProcessing(false);
  };

  const downloadImage = () => {
    if (!editedImage) return;
    
    const link = document.createElement('a');
    link.download = 'professional-photo.jpg';
    link.href = editedImage;
    link.click();
  };

  const resetFilters = () => {
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setEditedImage(image);
  };

  React.useEffect(() => {
    if (image) {
      applyFilters(brightness[0], contrast[0], saturation[0]);
    }
  }, [brightness, contrast, saturation, image, applyFilters]);

  if (isProcessing) {
    return <ResumeLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
            <Camera className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brand-text-primary)]">Professional Photo Editor</h1>
          </div>
          <p className="text-lg sm:text-xl text-[var(--brand-text-secondary)] max-w-2xl mx-auto px-4">
            Transform your photos into professional headshots perfect for your resume
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6">
            <PhotoUploader
              image={image}
              editedImage={editedImage}
              onUpload={handleImageUpload}
              onDownload={downloadImage}
              fileInputRef={fileInputRef}
            />

            {image && (
              <AIEnhancer
                onEnhance={enhanceWithAI}
                onBackground={generateProfessionalBackground}
                isProcessing={isProcessing}
              />
            )}
          </div>

          {image && (
            <div className="space-y-6">
              <ManualFilters
                brightness={brightness}
                onBrightnessChange={setBrightness}
                contrast={contrast}
                onContrastChange={setContrast}
                saturation={saturation}
                onSaturationChange={setSaturation}
                onReset={resetFilters}
              />

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Professional Photo Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• Use good lighting - natural light works best</li>
                    <li>• Keep a neutral, professional background</li>
                    <li>• Dress professionally and maintain good posture</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}