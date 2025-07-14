import { Loader2 } from "lucide-react";

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export const PageLoading = ({ 
  message = "Loading...", 
  className = "min-h-screen bg-background" 
}: PageLoadingProps) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};