import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, User, Heart, GraduationCap, Building2, ArrowLeft } from "lucide-react";
import { UserRole } from "./WelcomePage";

interface RegistrationFormProps {
  userRole: UserRole;
  onComplete: (userData: any) => void;
  onBack: () => void;
}

export const RegistrationForm = ({ userRole, onComplete, onBack }: RegistrationFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [study, setStudy] = useState("");
  const [swiperType, setSwiperType] = useState<"student" | "professor">("student");
  
  // Startup-specific fields
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [usp, setUsp] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [industry, setIndustry] = useState("");
  const [founded, setFounded] = useState("");
  const [employees, setEmployees] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required");
      return;
    }
    
    if (userRole === "startup") {
      if (name.trim() && tagline.trim() && description.trim() && usp.trim() && 
          mission.trim() && vision.trim() && industry.trim() && founded.trim() && employees.trim() && imageUrl.trim()) {
        onComplete({ 
          username: username.trim(),
          password: password.trim(),
          name: name.trim(), 
          tagline: tagline.trim(),
          description: description.trim(),
          usp: usp.trim(),
          mission: mission.trim(),
          vision: vision.trim(),
          industry: industry.trim(),
          founded: founded.trim(),
          employees: employees.trim(),
          image: imageUrl.trim() || undefined,
          role: userRole 
        });
      }
    } else {
      if (name.trim() && age.trim() && study.trim()) {
        onComplete({ 
          username: username.trim(),
          password: password.trim(),
          name: name.trim(), 
          age: age.trim(), 
          study: study.trim(), 
          swiperType: swiperType,
          role: "swiper"
        });
      }
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "swiper": return Heart;
      case "professor": return GraduationCap;
      case "startup": return Building2;
      default: return User;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "swiper": return "from-pink-600 to-red-600";
      case "professor": return "from-blue-600 to-indigo-600";
      case "startup": return "from-green-600 to-emerald-600";
      default: return "from-gray-600 to-gray-700";
    }
  };

  const getRoleButtonColor = () => {
    switch (userRole) {
      case "swiper": return "from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600";
      case "professor": return "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600";
      case "startup": return "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600";
      default: return "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700";
    }
  };

  const getStudyLabel = () => {
    if (userRole === "startup") return "What industry is your startup in?";
    return swiperType === "professor" ? "What department do you teach in?" : "What are you studying?";
  };

  const getStudyPlaceholder = () => {
    if (userRole === "startup") return "e.g. FinTech, HealthTech, EdTech, etc.";
    return swiperType === "professor" ? "e.g. Computer Science, Business Administration, etc." : "e.g. Computer Science, Business, etc.";
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MoQi
              </CardTitle>
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
            <div className="w-8" />
          </div>
          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${getRoleColor()} flex items-center justify-center mb-4`}>
            <RoleIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Create your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a password"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {userRole === "startup" ? (
              <>
                <div>
                  <Label htmlFor="name">Startup Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your startup name"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. AI-powered mental wellness"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of what your startup does"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="usp">Unique Selling Proposition</Label>
                  <Textarea
                    id="usp"
                    value={usp}
                    onChange={(e) => setUsp(e.target.value)}
                    placeholder="What makes your startup unique?"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mission">Mission</Label>
                    <Textarea
                      id="mission"
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      placeholder="Your startup's mission"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vision">Vision</Label>
                    <Textarea
                      id="vision"
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      placeholder="Your startup's vision"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. FinTech, HealthTech, EdTech"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      type="text"
                      value={founded}
                      onChange={(e) => setFounded(e.target.value)}
                      placeholder="e.g. 2023"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="employees">Team Size</Label>
                    <Input
                      id="employees"
                      type="text"
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      placeholder="e.g. 5-10, 15-25"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="imageUrl">Startup Image URL *</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/your-startup-image.jpg"
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add an image URL that represents your startup. This will be shown to swipers.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>I am a:</Label>
                  <RadioGroup value={swiperType} onValueChange={(value: "student" | "professor") => setSwiperType(value)} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professor" id="professor" />
                      <Label htmlFor="professor">Professor</Label>
                    </div>
                  </RadioGroup>
                </div>

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
              </>
            )}
            
            <Button 
              type="submit" 
              className={`w-full bg-gradient-to-r ${getRoleButtonColor()}`}
            >
              <User className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
