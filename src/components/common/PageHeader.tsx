import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

export const PageHeader = ({ 
  title, 
  subtitle, 
  onBack, 
  showBackButton = true,
  rightContent 
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-16">
      {showBackButton && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground font-normal"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}
      
      {title && (
        <div className="text-center flex-1">
          <h1 className="text-3xl md:text-4xl font-normal mb-2 text-foreground leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {rightContent && (
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      )}
    </div>
  );
};