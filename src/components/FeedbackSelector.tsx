
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, UserX } from "lucide-react";
import type { FeedbackType } from "@/pages/Index";

interface FeedbackSelectorProps {
  value: FeedbackType;
  onChange: (type: FeedbackType) => void;
}

export const FeedbackSelector = ({ value, onChange }: FeedbackSelectorProps) => {
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
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Feedback Preference
      </label>
      <div className="grid gap-2">
        {feedbackOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = value === option.type;
          return (
            <Button
              key={option.type}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-3 justify-start text-left ${
                isSelected 
                  ? option.color 
                  : "bg-white hover:bg-gray-50 border-gray-200"
              }`}
              onClick={() => onChange(option.type)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full ${
                  isSelected 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">{option.title}</div>
                  <div className={`text-xs ${
                    isSelected ? "text-white/80" : "text-gray-500"
                  }`}>
                    {option.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
