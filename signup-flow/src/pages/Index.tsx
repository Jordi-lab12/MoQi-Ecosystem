
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Building2 } from "lucide-react";
import StudentRegistration from "@/components/StudentRegistration";

const Index = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    if (type === "student") {
      setShowRegistration(true);
    }
  };

  if (showRegistration && userType === "student") {
    return <StudentRegistration />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            MoQi
          </h1>
          <p className="text-gray-400 mt-2">Welcome to the future of connections</p>
        </div>

        {!userType ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Join MoQi</CardTitle>
              <CardDescription className="text-gray-400">
                Choose your profile type to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleUserTypeSelection("student")}
                className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">I'm a Student</div>
                    <div className="text-sm opacity-80">Looking for opportunities</div>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleUserTypeSelection("startup")}
                className="w-full h-16 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">I'm a Startup</div>
                    <div className="text-sm opacity-80">Looking for talent</div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center">
            <p className="text-gray-400">
              You selected: <span className="text-blue-400 font-semibold">{userType}</span>
            </p>
            <Button
              onClick={() => setUserType(null)}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Change selection
            </Button>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
