
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, User } from "lucide-react";

interface RegistrationFormProps {
  onComplete: (userData: { name: string; age: string; study: string }) => void;
}

export const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [study, setStudy] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age.trim() && study.trim()) {
      onComplete({ name: name.trim(), age: age.trim(), study: study.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StartupMixer
            </CardTitle>
            <Sparkles className="w-8 h-8 text-pink-500" />
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
              <Label htmlFor="study">What are you studying?</Label>
              <Input
                id="study"
                type="text"
                value={study}
                onChange={(e) => setStudy(e.target.value)}
                placeholder="e.g. Computer Science, Business, etc."
                className="mt-1"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
