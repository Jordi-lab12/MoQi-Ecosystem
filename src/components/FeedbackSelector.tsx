
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, UserX } from "lucide-react";
import type { FeedbackType } from "@/pages/Index";

interface FeedbackSelectorProps {
  onSelect: (type: FeedbackType) => void;
}

export const FeedbackSelector = ({ onSelect }: FeedbackSelectorProps) => {
  const feedbackOptions = [
    {
      type: "no" as FeedbackType,
      title: "No Feedback",
      description: "I prefer not to provide feedback to startups",
      icon: UserX,
      color: "bg-gray-500 hover:bg-gray-600"
    },
    {
      type: "group" as FeedbackType,
      title: "Group Feedback Only",
      description: "I'm willing to participate in group feedback sessions",
      icon: Users,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      type: "all" as FeedbackType,
      title: "All Feedback",
      description: "I'm happy to provide both individual and group feedback",
      icon: MessageSquare,
      color: "bg-green-500 hover:bg-green-600"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Feedback Preferences</h1>
          <p className="text-gray-600">
            Would you like to provide feedback to the startups you've allocated coins to?
          </p>
        </div>

        <div className="grid gap-6">
          {feedbackOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.type} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onSelect(option.type)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${option.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {option.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{option.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your feedback helps startups improve and grow
          </p>
        </div>
      </div>
    </div>
  );
};
