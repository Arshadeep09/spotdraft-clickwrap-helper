import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Globe, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();

  const handleBackToSignup = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-careem relative overflow-hidden">
      {/* Floating geometric shapes - same as signup */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-shape-1 rounded-3xl opacity-80 animate-float"></div>
        <div className="absolute top-32 right-16 w-48 h-48 bg-gradient-shape-2 rounded-2xl opacity-70 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-32 w-56 h-56 bg-gradient-shape-3 rounded-3xl opacity-75 animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-shape-4 rounded-2xl opacity-80 animate-float"></div>
        
        {/* Medium shapes */}
        <div className="absolute top-64 left-1/2 w-32 h-32 bg-gradient-shape-2 rounded-xl opacity-60 animate-float-delayed"></div>
        <div className="absolute top-20 right-1/3 w-24 h-24 bg-gradient-shape-3 rounded-lg opacity-70 animate-float-slow"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-gradient-shape-1 rounded-xl opacity-65 animate-float"></div>
        
        {/* Small shapes */}
        <div className="absolute top-48 left-2/3 w-16 h-16 bg-gradient-shape-4 rounded-lg opacity-50 animate-float-slow"></div>
        <div className="absolute bottom-64 right-1/4 w-20 h-20 bg-gradient-shape-2 rounded-lg opacity-60 animate-float-delayed"></div>
      </div>

      {/* Header */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
        <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <HelpCircle className="h-4 w-4" />
          <span className="text-sm">Help Center</span>
        </div>
        <Select defaultValue="english">
          <SelectTrigger className="w-32 border-none bg-white/10 backdrop-blur-sm text-white">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="arabic">العربية</SelectItem>
            <SelectItem value="urdu">اردو</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Confirmation Card */}
          <Card className="bg-gradient-card backdrop-blur-sm shadow-careem border-0 relative">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="text-3xl font-bold text-primary">
                  Careem
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Account Created Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Welcome to Careem! Your account has been created and all terms have been accepted.
                </p>
                <p className="text-sm text-muted-foreground">
                  You can now enjoy all the benefits of our ride-hailing services.
                </p>
              </div>

              <Button
                onClick={handleBackToSignup}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-soft transition-all duration-300 hover:shadow-careem hover:scale-[1.02]"
              >
                Back to Sign Up
              </Button>

              <p className="text-xs text-muted-foreground pt-4">
                This page is protected by reCAPTCHA and is subject to the Google Privacy Policy and Terms of Service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;