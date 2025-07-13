import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, UserX } from "lucide-react";
import type { Startup, FeedbackType } from "@/pages/Index";

interface FeedbackPreferencesProps {
  startups: Startup[];
  initialPreferences: Record<string, FeedbackType>;
  onComplete: (preferences: Record<string, FeedbackType>) => void;
}

export const FeedbackPreferences = ({ startups, initialPreferences, onComplete }: FeedbackPreferencesProps) => {
  const [preferences, setPreferences] = useState<Record<string, FeedbackType>>(initialPreferences);

  const feedbackOptions = [
    {
      type: "no" as FeedbackType,
      title: "No Feedback",
      description: "I prefer not to provide feedback",
      icon: UserX,
      color: "border-gray-300 hover:border-gray-400 text-gray-700"
    },
    {
      type: "group" as FeedbackType,
      title: "Group Sessions Only",
      description: "I'm willing to participate in group feedback sessions",
      icon: Users,
      color: "border-blue-300 hover:border-blue-400 text-blue-700"
    },
    {
      type: "all" as FeedbackType,
      title: "All Feedback",
      description: "I'm happy to provide both individual and group feedback",
      icon: MessageSquare,
      color: "border-green-300 hover:border-green-400 text-green-700"
    }
  ];

  const handlePreferenceChange = (startupId: string, preference: FeedbackType) => {
    setPreferences(prev => ({
      ...prev,
      [startupId]: preference
    }));
  };

  const handleComplete = () => {
    onComplete(preferences);
  };

  const allPreferencesSet = startups.every(startup => preferences[startup.id]);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Set Your Feedback Preferences 💬
          </h1>
          <p className="text-gray-600 mb-6">
            Choose how you'd like to provide feedback to each startup you liked
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {startups.map((startup) => (
            <Card key={startup.id} className="overflow-hidden shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{startup.logo}</div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{startup.name}</CardTitle>
                    <p className="text-gray-600">{startup.tagline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {feedbackOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = preferences[startup.id] === option.type;
                    return (
                      <Button
                        key={option.type}
                        variant="outline"
                        className={`h-auto p-4 justify-start text-left border-2 transition-all ${
                          isSelected 
                            ? "border-purple-400 bg-purple-50 text-purple-700" 
                            : option.color
                        }`}
                        onClick={() => handlePreferenceChange(startup.id, option.type)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            isSelected 
                              ? "bg-purple-100 text-purple-600" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-base">{option.title}</div>
                            <div className="text-sm opacity-80">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleComplete}
            disabled={!allPreferencesSet}
            className="px-8 py-4 text-lg font-bold rounded-2xl flex items-center gap-3 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
          >
            Continue to Allocation <ArrowRight className="w-5 h-5" />
          </Button>
          {!allPreferencesSet && (
            <p className="text-red-500 mt-4">
              Please set feedback preferences for all startups to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};