import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { UpdateHeader } from "./UpdateHeader";

interface StartupUpdate {
  id: string;
  title: string;
  week_ending: string;
  key_achievements: string;
  challenges_faced: string;
  metrics_update: string;
  upcoming_goals: string;
  team_highlights: string;
  images: string[];
  created_at: string;
}

interface UpdateSidebarProps {
  updates: StartupUpdate[];
  selectedUpdate: StartupUpdate | null;
  onUpdateSelect: (update: StartupUpdate) => void;
  onBack: () => void;
  startupName: string;
  isDesktop?: boolean;
}

export const UpdateSidebar = ({ 
  updates, 
  selectedUpdate, 
  onUpdateSelect, 
  onBack, 
  startupName,
  isDesktop = false 
}: UpdateSidebarProps) => {
  if (isDesktop) {
    return (
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        <UpdateHeader onBack={onBack} startupName={startupName} />
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {updates.map((update) => (
              <div
                key={update.id}
                onClick={() => onUpdateSelect(update)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedUpdate?.id === update.id
                    ? 'bg-primary/10 border-primary/30 shadow-sm'
                    : 'bg-white border-border hover:border-primary/40 hover:shadow-sm'
                }`}
              >
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{update.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(update.week_ending).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          All Updates ({updates.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {updates.map((update) => (
          <div
            key={update.id}
            onClick={() => onUpdateSelect(update)}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedUpdate?.id === update.id
                ? 'bg-primary/5 border-primary/20 shadow-sm'
                : 'border-border hover:border-primary/40 hover:bg-muted/50'
            }`}
          >
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{update.title}</h3>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {new Date(update.week_ending).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: isDesktop ? 'numeric' : undefined
                })}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};