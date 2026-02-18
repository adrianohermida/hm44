import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Download } from "lucide-react";

export default function PhotoUploader({ 
  image, 
  editedImage, 
  onUpload, 
  onDownload, 
  fileInputRef 
}) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-purple-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer hover:border-purple-400 transition-colors"
          >
            <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your photo</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Drag and drop or click to select</p>
            <Badge variant="outline" className="text-xs sm:text-sm">JPG, PNG up to 10MB</Badge>
            <Input ref={fileInputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={editedImage || image} alt="Professional headshot" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="flex-1">
                <Upload className="w-4 h-4 mr-2" /> Change Photo
              </Button>
              <Button onClick={onDownload} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600" disabled={!editedImage}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
            <Input ref={fileInputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}