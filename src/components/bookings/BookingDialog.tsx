import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    id: string;
    business_name: string;
    base_price: number;
    portfolio_images?: string[];
  };
}

type FormData = {
  date: Date;
  timeSlot: string;
  specialRequirements: string;
};

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const BookingDialog = ({ isOpen, onClose, provider }: BookingDialogProps) => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      specialRequirements: "",
    },
  });

  const handlePayment = async (bookingId: string) => {
    try {
      const advanceAmount = provider.base_price * 0.3;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          bookingId,
          paymentType: 'advance',
          amount: advanceAmount,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again.",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to book a service",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: booking, error } = await supabase.from("bookings").insert({
        user_id: session.user.id,
        provider_id: provider.id,
        service_date: format(data.date, "yyyy-MM-dd"),
        time_slot: data.timeSlot,
        special_requirements: data.specialRequirements,
      }).select().single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your booking has been submitted. Proceeding to payment...",
      });

      await handlePayment(booking.id);
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-ceremonial-maroon">Book Service with {provider.business_name}</DialogTitle>
        </DialogHeader>

        {provider.portfolio_images && provider.portfolio_images.length > 0 && (
          <div className="mb-6">
            <Carousel>
              <CarouselContent>
                {provider.portfolio_images.map((image, index) => (
                  <CarouselItem key={index}>
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/portfolio_images/${image}`}
                        alt={`Portfolio ${index + 1}`}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Date</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="rounded-md border"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or notes..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm text-gray-500">
              <p>Advance Payment (30%): ₹{(provider.base_price * 0.3).toFixed(2)}</p>
              <p>Final Payment (70%): ₹{(provider.base_price * 0.7).toFixed(2)}</p>
              <p className="font-semibold">Total: ₹{provider.base_price.toFixed(2)}</p>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Book and Pay"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;