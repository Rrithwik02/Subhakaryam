import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual registration logic
    toast({
      title: "Coming Soon",
      description: "Registration functionality will be implemented soon.",
    });
  };

  return (
    <div className="min-h-screen bg-ceremonial-cream flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-ceremonial-maroon mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join our community today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input id="name" type="text" placeholder="Enter your name" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
          >
            Create Account
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Button
            variant="link"
            className="text-ceremonial-maroon hover:text-ceremonial-maroon/90 p-0"
            onClick={() => navigate("/login")}
          >
            Sign in here
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;