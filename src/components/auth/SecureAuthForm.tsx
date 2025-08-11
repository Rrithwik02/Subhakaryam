import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordValidation } from "./PasswordValidation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

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
            emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`
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