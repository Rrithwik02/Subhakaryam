
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { format, addDays, differenceInDays } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateRange } from "react-day-picker";

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
  endDate?: Date;
  timeSlot: string;
  specialRequirements: string;
  paymentPreference: 'pay_now' | 'pay_on_delivery';
  isMultiDay: boolean;
  totalDays: number;
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
  const [showProviderContact, setShowProviderContact] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      specialRequirements: "",
      paymentPreference: 'pay_now',
      isMultiDay: false,
      totalDays: 1,
    },
  });

  const watchIsMultiDay = form.watch("isMultiDay");
  const watchTotalDays = form.watch("totalDays");
  const watchDate = form.watch("date");

  // Calculate total price based on days
  const totalPrice = provider.base_price * watchTotalDays;

  // Check availability for multiple days
  const checkMultiDayAvailability = async (startDate: Date, totalDays: number, timeSlot: string) => {
    if (!startDate || !timeSlot || totalDays < 1) return true;

    try {
      for (let i = 0; i < totalDays; i++) {
        const currentDate = addDays(startDate, i);
        const dayOfWeek = currentDate.getDay();

        // Check provider availability for this day of week
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('service_provider_availability')
          .select('*')
          .eq('provider_id', provider.id)
          .eq('day_of_week', dayOfWeek)
          .single();

        if (availabilityError || !availabilityData) {
          toast({
            variant: "destructive",
            title: "Provider Unavailable",
            description: `The provider is not available on ${format(currentDate, "MMM dd")}.`,
          });
          return false;
        }

        // Check time slot within available hours
        const requestedTime = new Date(`2000-01-01T${timeSlot}`);
        const startTime = new Date(`2000-01-01T${availabilityData.start_time}`);
        const endTime = new Date(`2000-01-01T${availabilityData.end_time}`);

        if (requestedTime < startTime || requestedTime > endTime) {
          toast({
            variant: "destructive",
            title: "Time Slot Unavailable",
            description: `Provider is only available between ${availabilityData.start_time} and ${availabilityData.end_time} on ${format(currentDate, "MMM dd")}.`,
          });
          return false;
        }

        // Check for existing bookings on this date
        const { data: existingBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('provider_id', provider.id)
          .eq('service_date', format(currentDate, "yyyy-MM-dd"))
          .eq('time_slot', timeSlot)
          .neq('status', 'rejected');

        if (bookingsError) throw bookingsError;

        if (existingBookings && existingBookings.length > 0) {
          toast({
            variant: "destructive",
            title: "Time Slot Unavailable",
            description: `This time slot is already booked on ${format(currentDate, "MMM dd")}. Please select different dates or time.`,
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking multi-day availability:', error);
      return false;
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

    if (!data.date || !data.timeSlot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both date and time slot",
      });
      return;
    }

    // Check availability before proceeding
    const isAvailable = await checkMultiDayAvailability(data.date, data.totalDays, data.timeSlot);
    if (!isAvailable) return;

    setIsSubmitting(true);
    try {
      const endDate = addDays(data.date, data.totalDays - 1);
      
      // First create the booking with multi-day support
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: session.user.id,
          provider_id: provider.id,
          service_date: format(data.date, "yyyy-MM-dd"), // Keep for backward compatibility
          start_date: format(data.date, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          total_days: data.totalDays,
          total_amount: totalPrice,
          time_slot: data.timeSlot,
          special_requirements: data.specialRequirements,
          payment_preference: data.paymentPreference,
          status: data.paymentPreference === 'pay_now' ? 'pending_payment' : 'pending',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      if (data.paymentPreference === 'pay_on_delivery') {
        // Create chat connection for pay on delivery
        const { error: chatError } = await supabase
          .from("chat_connections")
          .insert({
            booking_id: booking.id,
            user_id: session.user.id,
            provider_id: provider.id,
          });

        if (chatError) throw chatError;

        toast({
          title: "Booking Confirmed",
          description: "Your booking has been confirmed! You can now chat with the service provider.",
        });
      } else {
        toast({
          title: "Redirecting to Payment",
          description: "You will be redirected to complete the payment.",
        });
        // Implement payment redirection here
      }

      onClose();
      form.reset();
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Book Service with {provider.business_name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <Form {...form}>
            <form id="booking-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="isMultiDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Multi-day booking</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Book this service for multiple consecutive days
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {watchIsMultiDay ? "Start Date" : "Select Date"}
                  </FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="rounded-md border pointer-events-auto"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchIsMultiDay && (
              <FormField
                control={form.control}
                name="totalDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Days: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={30}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    {watchDate && (
                      <div className="text-sm text-muted-foreground">
                        Service period: {format(watchDate, "MMM dd")} - {format(addDays(watchDate, watchTotalDays - 1), "MMM dd, yyyy")}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <FormField
              control={form.control}
              name="paymentPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pay_now" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pay Now (Online Payment)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pay_on_delivery" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pay on Delivery (Cash)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Base price per day:</span>
                  <span className="text-sm">₹{provider.base_price.toFixed(2)}</span>
                </div>
                {watchIsMultiDay && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Number of days:</span>
                    <span className="text-sm">{watchTotalDays}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-semibold border-t pt-2">
                  <span>Total Price:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            </form>
          </Form>
        </div>

        <DialogFooter className="flex-shrink-0 mt-4">
          <Button
            type="submit"
            form="booking-form"
            className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Book Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
