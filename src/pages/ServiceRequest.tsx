
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";

const serviceRequestSchema = z.object({
  description: z.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
});

const ServiceRequest = () => {
  const { toast } = useToast();
  const { session, isLoading } = useSessionContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const [formData, setFormData] = useState({
    service_type: "",
    description: "",
    city: "",
    preferred_time: "",
    budget_range: "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    try {
      const validated = serviceRequestSchema.parse({ description: formData.description });
      
      setIsSubmitting(true);

      // Insert form data to service_requests table
      const { error } = await supabase
        .from('service_requests')
        .insert({
          user_id: session.user.id,
          service_type: formData.service_type,
          description: validated.description,
          city: formData.city,
          preferred_date: date ? date.toISOString().split('T')[0] : null,
          preferred_time: formData.preferred_time || null,
          budget_range: formData.budget_range || null,
        });

      if (error) throw error;

      toast({
        title: "Service Request Submitted",
        description: "Your service request has been submitted successfully. We'll get back to you soon.",
      });
      
      // Reset form after successful submission
      setFormData({
        service_type: "",
        description: "",
        city: "",
        preferred_time: "",
        budget_range: "",
      });
      setDate(undefined);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.issues[0].message,
        });
        return;
      }
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-ceremonial-cream pt-20">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center text-ceremonial-maroon mb-8">
          Request a Service
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => handleSelectChange("service_type", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poojari">Poojari/Priest</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="decoration">Decoration</SelectItem>
                    <SelectItem value="photography">Photography & Videography</SelectItem>
                    <SelectItem value="mehndi">Mehndi Artist</SelectItem>
                    <SelectItem value="music">Music & Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => handleSelectChange("city", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date (Optional)
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time (Optional)
                  </label>
                  <div className="relative">
                    <Input
                      id="preferred_time"
                      name="preferred_time"
                      type="time"
                      value={formData.preferred_time}
                      onChange={handleChange}
                      className="w-full"
                    />
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range (Optional)
                </label>
                <Select
                  value={formData.budget_range}
                  onValueChange={(value) => handleSelectChange("budget_range", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_5000">Under ₹5,000</SelectItem>
                    <SelectItem value="5000_10000">₹5,000 - ₹10,000</SelectItem>
                    <SelectItem value="10000_25000">₹10,000 - ₹25,000</SelectItem>
                    <SelectItem value="25000_50000">₹25,000 - ₹50,000</SelectItem>
                    <SelectItem value="above_50000">Above ₹50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Describe Your Requirements
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[150px]"
                  placeholder="Please describe your requirements in detail... (10-1000 characters)"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.trim().length}/1000 characters
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;
