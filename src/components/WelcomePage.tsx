
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, GraduationCap, Building2, ArrowRight } from "lucide-react";

export type UserRole = "swiper" | "professor" | "startup";

interface WelcomePageProps {
  onRoleSelected: (role: UserRole) => void;
}

export const WelcomePage = ({ onRoleSelected }: WelcomePageProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    {
      id: "swiper" as UserRole,
      title: "Swiper",
      subtitle: "Student & Professor Hub",
      description: "For students and professors that want to innovate and help ideas to flourish",
      icon: Heart,
      color: "from-pink-500 to-red-500",
      hoverColor: "hover:from-pink-600 hover:to-red-600",
      bgColor: "bg-gradient-to-br from-pink-50 to-red-50",
    },
    {
      id: "startup" as UserRole,
      title: "Startup",
      subtitle: "Innovation Hub",
      description: "Find talented students and build the future together",
      icon: Building2,
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/lovable-uploads/70545324-72aa-4d39-9b13-d0f991dc6d19.png" 
              alt="MoQi Logo" 
              className="w-20 h-20 filter brightness-0 invert"
            />
            <h1 className="text-6xl font-bold text-white">
              MoQi
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-2">Welcome to the future of startup connections</p>
          <p className="text-lg text-gray-400">Choose your role to get started</p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 ${
                  isSelected 
                    ? 'border-white shadow-2xl scale-105' 
                    : 'border-gray-600 hover:border-gray-400'
                } bg-gray-800/50 backdrop-blur-sm`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {role.title}
                  </CardTitle>
                  <p className="text-gray-300 font-medium">{role.subtitle}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 leading-relaxed">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedRole && (
          <div className="text-center animate-fade-in">
            <Button 
              onClick={() => onRoleSelected(selectedRole)}
              className={`px-12 py-6 text-xl font-bold rounded-2xl bg-gradient-to-r ${
                roles.find(r => r.id === selectedRole)?.color
              } ${
                roles.find(r => r.id === selectedRole)?.hoverColor
              } text-white shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-4 mx-auto`}
            >
              Continue as {roles.find(r => r.id === selectedRole)?.title}
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
