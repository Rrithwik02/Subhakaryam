import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordValidation } from "./PasswordValidation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SecureAuthFormProps {
  mode: "sign_in" | "sign_up";
  onModeChange: (mode: "sign_in" | "sign_up") => void;
  redirectTo?: string;
}

export const SecureAuthForm = ({ mode, onModeChange, redirectTo }: SecureAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8 &&
           /[A-Z]/.test(pwd) &&
           /[a-z]/.test(pwd) &&
           /\d/.test(pwd) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || 'https://subhakary.com/auth/callback'
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "sign_up") {
        if (!validatePassword(password)) {
          throw new Error("Password does not meet security requirements");
        }
        
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo || 'https://subhakary.com/auth/callback'
          }
        });

        if (error) throw error;

        toast({
          title: "Account Created",
          description: "Please check your email to confirm your account."
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully."
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-2">
          {mode === "sign_up" ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-gray-600 mb-6">
          {mode === "sign_up" ? "Join our community today" : "Sign in to your account"}
        </p>
      </div>

      {/* Google Sign-In Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-2 border-gray-200 hover:bg-gray-50"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {mode === "sign_up" ? "Sign up with Google" : "Continue with Google"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {mode === "sign_up" && (
          <>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <PasswordValidation password={password} />
          </>
        )}

        <Button
          type="submit"
          className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
          disabled={isLoading || (mode === "sign_up" && !validatePassword(password))}
        >
          {isLoading 
            ? (mode === "sign_up" ? "Creating Account..." : "Signing In...") 
            : (mode === "sign_up" ? "Create Account" : "Sign In")
          }
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => onModeChange(mode === "sign_up" ? "sign_in" : "sign_up")}
        >
          {mode === "sign_up" 
            ? "Already have an account? Sign in" 
            : "Don't have an account? Sign up"
          }
        </Button>
      </div>

      <div className="mt-4 p-4 bg-ceremonial-cream/50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          Your account is protected with enterprise-grade security.
        </p>
      </div>
    </Card>
  );
};