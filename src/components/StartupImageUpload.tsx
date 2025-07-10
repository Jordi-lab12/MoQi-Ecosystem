import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera, Link, Save } from "lucide-react";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StartupImageUploadProps {
  currentImage?: string;
  onImageUpdate: (imageUrl: string) => void;
}

export const StartupImageUpload = ({ currentImage, onImageUpdate }: StartupImageUploadProps) => {
  const { profile } = useSupabaseData();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim() || !profile) return;

    try {
      setIsUploading(true);
      
      // Update profile with new image URL
      const { error } = await supabase
        .from('profiles')
        .update({ image: imageUrl.trim() })
        .eq('id', profile.id);

      if (error) throw error;

      onImageUpdate(imageUrl.trim());
      
      toast({
        title: "Success",
        description: "Profile image updated successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: "Error",
        description: "Failed to update profile image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    try {
      setIsUploading(true);

      // Upload file to a simple image hosting service (placeholder for now)
      // In a real app, you'd use Supabase Storage or another service
      const formData = new FormData();
      formData.append('file', file);

      // For now, we'll show a placeholder message
      toast({
        title: "File Upload",
        description: "File upload feature coming soon. Please use an image URL for now.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-500" />
          Profile Picture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Image Preview */}
        {currentImage && (
          <div className="text-center">
            <img 
              src={currentImage} 
              alt="Current profile" 
              className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
              onError={(e) => {
                e.currentTarget.src = `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center`;
              }}
            />
            <p className="text-sm text-gray-600">Current profile picture</p>
          </div>
        )}

        {/* URL Input Method */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Image URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              className="flex-1"
            />
            <Button 
              onClick={handleUrlSubmit}
              disabled={!imageUrl.trim() || isUploading}
              size="sm"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* File Upload Method */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload File (Coming Soon)
          </Label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={true}
              className="flex-1"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={true}
              variant="outline"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-1" />
              Browse
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            File upload feature coming soon. Use image URL for now.
          </p>
        </div>

        {/* Suggested Placeholder Images */}
        <div className="space-y-2">
          <Label>Quick Options</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center",
              "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center",
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop&crop=center"
            ].map((url, index) => (
              <button
                key={index}
                onClick={() => setImageUrl(url)}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
              >
                <img 
                  src={url} 
                  alt={`Option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};