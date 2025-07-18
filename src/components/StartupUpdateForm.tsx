import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Upload, Save, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StartupUpdateFormProps {
  onBack: () => void;
  startupId: string;
}

export const StartupUpdateForm = ({ onBack, startupId }: StartupUpdateFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    week_ending: "",
    key_achievements: "",
    challenges_faced: "",
    metrics_update: "",
    upcoming_goals: "",
    team_highlights: ""
  });

  const questions = [
    {
      step: 1,
      title: "Weekly Update Details",
      fields: [
        { key: "title", label: "Update Title", placeholder: "Week of [Date] - Company Progress Update", type: "input" },
        { key: "week_ending", label: "Week Ending", type: "date" }
      ]
    },
    {
      step: 2,
      title: "Achievements & Progress",
      fields: [
        { key: "key_achievements", label: "What were your key achievements this week?", placeholder: "Describe your major wins, milestones reached, or goals accomplished...", type: "textarea" }
      ]
    },
    {
      step: 3,
      title: "Challenges & Learnings",
      fields: [
        { key: "challenges_faced", label: "What challenges did you face and how did you overcome them?", placeholder: "Share any obstacles and your solutions...", type: "textarea" }
      ]
    },
    {
      step: 4,
      title: "Metrics & Data",
      fields: [
        { key: "metrics_update", label: "Share your key metrics and performance data", placeholder: "Revenue, user growth, engagement rates, or other relevant KPIs...", type: "textarea" }
      ]
    },
    {
      step: 5,
      title: "Future Goals",
      fields: [
        { key: "upcoming_goals", label: "What are your goals for next week?", placeholder: "Outline your priorities and objectives...", type: "textarea" }
      ]
    },
    {
      step: 6,
      title: "Team Highlights",
      fields: [
        { key: "team_highlights", label: "Any team updates or highlights?", placeholder: "New hires, team achievements, culture moments...", type: "textarea" }
      ]
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images",
        variant: "destructive"
      });
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      try {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('startup-images')
          .upload(`updates/${fileName}`, image);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('startup-images')
          .getPublicUrl(`updates/${fileName}`);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
    
    return uploadedUrls;
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const imageUrls = await uploadImages();
      
      const { error } = await supabase
        .from('startup_updates')
        .insert({
          startup_id: startupId,
          ...formData,
          images: imageUrls,
          is_published: false
        });

      if (error) throw error;

      toast({
        title: "Draft saved",
        description: "Your update has been saved as a draft"
      });
      
      onBack();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const imageUrls = await uploadImages();
      
      const { error } = await supabase
        .from('startup_updates')
        .insert({
          startup_id: startupId,
          ...formData,
          images: imageUrls,
          is_published: true
        });

      if (error) throw error;

      toast({
        title: "Update published!",
        description: "Your weekly update is now live and visible to your supporters"
      });
      
      onBack();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentStep - 1];
  const isLastStep = currentStep === questions.length;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative">
      {/* Logo in top left corner */}
      <div className="absolute top-4 left-4 z-10">
        <img 
          src="/lovable-uploads/70545324-72aa-4d39-9b13-d0f991dc6d19.png" 
          alt="MoQi Logo" 
          className="w-20 h-20"
        />
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Weekly Update
            </h1>
            <p className="text-gray-600 mt-2">Step {currentStep} of {questions.length + 1}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (questions.length + 1)) * 100}%` }}
          />
        </div>

        {isLastStep ? (
          // Image upload step
          <Card className="shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Add Images (Optional)</CardTitle>
              <p className="text-center text-gray-600">Upload up to 5 images to make your update more engaging</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Click to upload images or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-2">{images.length}/5 images uploaded</p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        onClick={() => removeImage(index)}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 justify-center pt-6">
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Publish Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Question steps
          <Card className="shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQuestion.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-lg font-medium">
                    {field.label}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.key}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="min-h-[120px]"
                      required
                    />
                  ) : field.type === "date" ? (
                    <Input
                      id={field.key}
                      type="date"
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      required
                    />
                  ) : (
                    <Input
                      id={field.key}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      required
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-4 justify-between pt-6">
                <Button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  variant="outline"
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};