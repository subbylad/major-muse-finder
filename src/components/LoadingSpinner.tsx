import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;