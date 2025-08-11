import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordValidationProps {
  password: string;
  className?: string;
}

export const PasswordValidation = ({ password, className }: PasswordValidationProps) => {
  const validations = [
    {
      test: password.length >= 8,
      message: "At least 8 characters"
    },
    {
      test: /[A-Z]/.test(password),
      message: "At least one uppercase letter"
    },
    {
      test: /[a-z]/.test(password),
      message: "At least one lowercase letter"
    },
    {
      test: /\d/.test(password),
      message: "At least one number"
    },
    {
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      message: "At least one special character"
    }
  ];

  const isPasswordValid = validations.every(v => v.test);

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium text-gray-700">Password Requirements:</h4>
      <ul className="space-y-1">
        {validations.map((validation, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            {validation.test ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className={validation.test ? "text-green-600" : "text-red-500"}>
              {validation.message}
            </span>
          </li>
        ))}
      </ul>
      {password && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all",
                isPasswordValid ? "bg-green-600" : "bg-red-500"
              )}
              style={{ 
                width: `${(validations.filter(v => v.test).length / validations.length) * 100}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};