
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdditionalQuestionsProps {
  studentData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

const AdditionalQuestions = ({ studentData }: AdditionalQuestionsProps) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    degree: "",
    department: "",
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 16 || Number(formData.age) > 100) {
      newErrors.age = "Please enter a valid age (16-100)";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.degree.trim()) {
      newErrors.degree = "Degree is required";
    }
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Complete student data:", { ...studentData, ...formData });
      toast({
        title: "Profile completed!",
        description: "Welcome to MoQi! Your account has been created successfully.",
      });
      setIsCompleted(true);
    }
  };

  const goBack = () => {
    window.location.reload();
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Welcome to MoQi!</CardTitle>
              <CardDescription className="text-gray-400">
                Your student profile has been created successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Hello <span className="text-blue-400 font-semibold">{studentData.firstName}</span>! 
                You're all set to start exploring opportunities on MoQi.
              </p>
              
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 h-12 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Start Exploring
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={goBack}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              MoQi
            </h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-full transition-all duration-500"></div>
          </div>
          <span className="text-sm text-gray-400">Step 2 of 2</span>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Tell us more about yourself</CardTitle>
            <CardDescription className="text-gray-400">
              Help us personalize your MoQi experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-300">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your age"
                  min="16"
                  max="100"
                />
                {errors.age && (
                  <p className="text-red-400 text-sm">{errors.age}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-300">
                  Gender
                </Label>
                <Select onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="male" className="text-white hover:bg-gray-600">Male</SelectItem>
                    <SelectItem value="female" className="text-white hover:bg-gray-600">Female</SelectItem>
                    <SelectItem value="non-binary" className="text-white hover:bg-gray-600">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say" className="text-white hover:bg-gray-600">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-400 text-sm">{errors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="degree" className="text-gray-300">
                  Degree
                </Label>
                <Select onValueChange={(value) => handleInputChange("degree", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your degree level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="high-school" className="text-white hover:bg-gray-600">High School</SelectItem>
                    <SelectItem value="associate" className="text-white hover:bg-gray-600">Associate's Degree</SelectItem>
                    <SelectItem value="bachelor" className="text-white hover:bg-gray-600">Bachelor's Degree</SelectItem>
                    <SelectItem value="master" className="text-white hover:bg-gray-600">Master's Degree</SelectItem>
                    <SelectItem value="phd" className="text-white hover:bg-gray-600">PhD</SelectItem>
                    <SelectItem value="other" className="text-white hover:bg-gray-600">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.degree && (
                  <p className="text-red-400 text-sm">{errors.degree}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-300">
                  Department/Field of Study
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Computer Science, Business, etc."
                />
                {errors.department && (
                  <p className="text-red-400 text-sm">{errors.department}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 h-12 font-semibold transition-all duration-300 transform hover:scale-105 mt-6"
              >
                Complete Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdditionalQuestions;
