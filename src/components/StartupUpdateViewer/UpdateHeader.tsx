import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface UpdateHeaderProps {
  onBack: () => void;
  startupName: string;
  isMobile?: boolean;
}

export const UpdateHeader = ({ onBack, startupName, isMobile = false }: UpdateHeaderProps) => {
  if (isMobile) {
    return (
      <div className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {startupName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{startupName} Updates</h1>
                <p className="text-sm text-muted-foreground">Weekly progress reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b">
      <Button onClick={onBack} variant="ghost" size="sm" className="mb-4 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Portfolio
      </Button>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold">
          {startupName.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold">{startupName}</h1>
          <p className="text-sm text-muted-foreground">Weekly Updates</p>
        </div>
      </div>
    </div>
  );
};