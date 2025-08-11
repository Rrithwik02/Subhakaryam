import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SimpleBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  serviceType: string;
  basePrice?: number;
}

type FormData = {
  date: Date | undefined;
  timeSlot: string;
  specialRequirements: string;
};

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

export const SimpleBookingDialog = ({ 
  isOpen, 
  onClose, 
  providerId, 
  serviceType,
  basePrice = 0
}: SimpleBookingDialogProps) => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      date: undefined,
      timeSlot: "",
      specialRequirements: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please log in to book a service",
      });
      return;
    }

    if (!data.date || !data.timeSlot) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a date and time slot",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
          user_id: session.user.id,
          provider_id: providerId,
          service_date: format(data.date, "yyyy-MM-dd"),
          time_slot: data.timeSlot,
          special_requirements: data.specialRequirements,
          total_amount: basePrice,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Create chat connection
      await supabase
        .from("chat_connections")
        .insert({
          booking_id: booking.id,
          user_id: session.user.id,
          provider_id: providerId,
        });

      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent successfully!",
      });

      onClose();
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal mt-1",
                    !form.watch("date") && "text-muted-foreground"
                  )}
                >
                  {form.watch("date") ? (
                    format(form.watch("date")!, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("date")}
                  onSelect={(date) => form.setValue("date", date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium">Select Time</label>
            <Select onValueChange={(value) => form.setValue("timeSlot", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Special Requirements</label>
            <Textarea
              placeholder="Any special requirements or notes..."
              value={form.watch("specialRequirements")}
              onChange={(e) => form.setValue("specialRequirements", e.target.value)}
              className="mt-1"
            />
          </div>

          {basePrice > 0 && (
            <div className="bg-ceremonial-cream/30 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-600">Starting from</div>
              <div className="text-lg font-semibold text-ceremonial-gold">
                ₹{basePrice.toLocaleString()}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-ceremonial-gold hover:bg-ceremonial-gold/90"
            >
              {isSubmitting ? "Booking..." : "Book Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};