import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Compass, Mail, Lock, ArrowLeft } from "lucide-react";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Confirm password validation (only for sign up)
    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (isSignUp) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to Align. Let's discover your ideal major.",
        });
        // Navigate to questionnaire after signup
        navigate("/questionnaire");
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        // For existing users, go to profile (or questionnaire if no previous results)
        navigate("/questionnaire");
      }
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-orange-accent/5 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">{/* Reduced from max-w-lg for better mobile experience */}
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 sm:mb-6 text-muted-foreground hover:text-foreground min-h-[44px] px-4 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
              <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-orange-accent bg-clip-text text-transparent">
            Join Align
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 px-2">
            {isSignUp ? "Create your account to get started" : "Welcome back to your journey"}
          </p>
        </div>

        {/* Auth Form */}
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Start discovering your ideal college major" 
                : "Continue your journey of discovery"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-4">
              {/* Email Field - Mobile Optimized */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 h-12 text-base ${errors.email ? "border-destructive" : ""} touch-manipulation`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Password Field - Mobile Optimized */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 h-12 text-base ${errors.password ? "border-destructive" : ""} touch-manipulation`}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Confirm Password Field (Sign Up Only) - Mobile Optimized */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 h-12 text-base ${errors.confirmPassword ? "border-destructive" : ""} touch-manipulation`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Submit Button - Mobile Optimized */}
              <Button 
                type="submit" 
                className="w-full min-h-[48px] bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium touch-manipulation"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>
            </form>

            {/* Toggle Sign In/Sign Up - Mobile Optimized */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormData({ email: "", password: "", confirmPassword: "" });
                    setErrors({});
                  }}
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline min-h-[44px] inline-flex items-center px-2 touch-manipulation"
                  disabled={isLoading}
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;