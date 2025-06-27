
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, User, Heart, GraduationCap, Building2 } from "lucide-react";
import { UserRole } from "./WelcomePage";

interface RegistrationFormProps {
  userRole: UserRole;
  onComplete: (userData: { name: string; age: string; study: string; role: UserRole }) => void;
}

export const RegistrationForm = ({ userRole, onComplete }: RegistrationFormProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [study, setStudy] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age.trim() && study.trim()) {
      onComplete({ name: name.trim(), age: age.trim(), study: study.trim(), role: userRole });
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "swiper": return Heart;
      case "professor": return GraduationCap;
      case "startup": return Building2;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "swiper": return "from-pink-600 to-red-600";
      case "professor": return "from-blue-600 to-indigo-600";
      case "startup": return "from-green-600 to-emerald-600";
    }
  };

  const getRoleButtonColor = () => {
    switch (userRole) {
      case "swiper": return "from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600";
      case "professor": return "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600";
      case "startup": return "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600";
    }
  };

  const getStudyLabel = () => {
    switch (userRole) {
      case "swiper": return "What are you studying?";
      case "professor": return "What department do you teach in?";
      case "startup": return "What industry is your startup in?";
    }
  };

  const getStudyPlaceholder = () => {
    switch (userRole) {
      case "swiper": return "e.g. Computer Science, Business, etc.";
      case "professor": return "e.g. Computer Science, Business Administration, etc.";
      case "startup": return "e.g. FinTech, HealthTech, EdTech, etc.";
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MoQi
            </CardTitle>
            <Sparkles className="w-8 h-8 text-pink-500" />
          </div>
          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${getRoleColor()} flex items-center justify-center mb-4`}>
            <RoleIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Tell us a bit about yourself</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                className="mt-1"
                min="16"
                max="100"
                required
              />
            </div>
            <div>
              <Label htmlFor="study">{getStudyLabel()}</Label>
              <Input
                id="study"
                type="text"
                value={study}
                onChange={(e) => setStudy(e.target.value)}
                placeholder={getStudyPlaceholder()}
                className="mt-1"
                required
              />
            </div>
            <Button 
              type="submit" 
              className={`w-full bg-gradient-to-r ${getRoleButtonColor()}`}
            >
              <User className="w-4 h-4 mr-2" />
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
