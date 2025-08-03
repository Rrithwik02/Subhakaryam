import { useState, useEffect } from "react";
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
import { format, addDays, differenceInDays } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateRange } from "react-day-picker";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MobileOptimizedDialogContent } from "@/components/ui/mobile-optimized-dialog";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    id: string;
    business_name: string;
    base_price: number;
    portfolio_images?: string[];
    requires_advance_payment?: boolean;
    advance_payment_percentage?: number;
  };
}

type FormData = {
  checkInDate: Date;
  checkOutDate: Date | undefined;
  timeSlot: string;
  specialRequirements: string;
  paymentPreference: 'pay_now' | 'pay_on_delivery';
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [providerAdvanceSettings, setProviderAdvanceSettings] = useState<{
    requiresAdvance: boolean;
    percentage: number;
  }>({ requiresAdvance: false, percentage: 0 });

  const form = useForm<FormData>({
    defaultValues: {
      specialRequirements: "",
      paymentPreference: 'pay_now',
    },
  });

  const watchCheckInDate = form.watch("checkInDate");
  const watchCheckOutDate = form.watch("checkOutDate");
  const watchPaymentPreference = form.watch("paymentPreference");

  // Load provider advance payment settings
  useEffect(() => {
    const loadProviderSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('service_providers')
          .select('requires_advance_payment, advance_payment_percentage')
          .eq('id', provider.id)
          .single();

        if (error) throw error;

        setProviderAdvanceSettings({
          requiresAdvance: data?.requires_advance_payment || false,
          percentage: data?.advance_payment_percentage || 0,
        });
      } catch (error) {
        console.error('Error loading provider settings:', error);
      }
    };

    if (provider.id && isOpen) {
      loadProviderSettings();
    }
  }, [provider.id, isOpen]);

  // Calculate total days and price
  const totalDays = watchCheckInDate && watchCheckOutDate 
    ? differenceInDays(watchCheckOutDate, watchCheckInDate) + 1 
    : 1;
  const totalPrice = provider.base_price * totalDays;
  
  // Calculate advance payment amounts
  const advanceAmount = providerAdvanceSettings.requiresAdvance 
    ? Math.round((totalPrice * providerAdvanceSettings.percentage) / 100)
    : 0;
  const finalAmount = totalPrice - advanceAmount;

  // Check availability for date range
  const checkDateRangeAvailability = async (startDate: Date, endDate: Date, timeSlot: string) => {
    if (!startDate || !endDate || !timeSlot) return true;

    try {
      const totalDays = differenceInDays(endDate, startDate) + 1;
      
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

        // Check for existing bookings on this date (only confirmed/accepted bookings block availability)
        const { data: existingBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('provider_id', provider.id)
          .eq('service_date', format(currentDate, "yyyy-MM-dd"))
          .eq('time_slot', timeSlot)
          .in('status', ['confirmed', 'accepted', 'completed']);

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
      console.error('Error checking availability:', error);
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

    if (!data.checkInDate || !data.timeSlot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select check-in date and time slot",
      });
      return;
    }

    const endDate = data.checkOutDate || data.checkInDate;

    // Check availability before proceeding
    const isAvailable = await checkDateRangeAvailability(data.checkInDate, endDate, data.timeSlot);
    if (!isAvailable) return;

    setIsSubmitting(true);
    try {
      // Create the booking with date range support
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: session.user.id,
          provider_id: provider.id,
          service_date: format(data.checkInDate, "yyyy-MM-dd"),
          start_date: format(data.checkInDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          total_days: totalDays,
          total_amount: totalPrice,
          time_slot: data.timeSlot,
          special_requirements: data.specialRequirements,
          payment_preference: data.paymentPreference,
          status: 'pending',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create chat connection for both payment types
      const { error: chatError } = await supabase
        .from("chat_connections")
        .insert({
          booking_id: booking.id,
          user_id: session.user.id,
          provider_id: provider.id,
        });

      if (chatError) throw chatError;

      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent to the service provider. Payment will be processed after they accept your request.",
      });

      onClose();
      form.reset();
      setDateRange(undefined);
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
      <MobileOptimizedDialogContent>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            Book Service with {provider.business_name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <Form {...form}>
            <form id="booking-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Date Range Selection - AbhiBus Style */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Dates</h3>
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {/* Check-in Date */}
                  <FormField
                    control={form.control}
                    name="checkInDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Check-in Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMM dd, yyyy")
                                ) : (
                                  <span>Pick check-in date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                           <PopoverContent 
                             className="w-auto p-0 max-w-[350px]" 
                             align="start"
                           >
                             <Calendar
                               mode="single"
                               selected={field.value}
                               onSelect={(date) => {
                                 field.onChange(date);
                                 if (date && (!watchCheckOutDate || date >= watchCheckOutDate)) {
                                   form.setValue("checkOutDate", addDays(date, 1));
                                 }
                               }}
                               disabled={(date) => date < new Date()}
                               initialFocus
                               className="pointer-events-auto"
                             />
                           </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Check-out Date */}
                  <FormField
                    control={form.control}
                    name="checkOutDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Check-out Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MMM dd, yyyy")
                                ) : (
                                  <span>Pick check-out date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                           <PopoverContent 
                             className="w-auto p-0 max-w-[350px]" 
                             align="start"
                           >
                             <Calendar
                               mode="single"
                               selected={field.value}
                               onSelect={field.onChange}
                               disabled={(date) => 
                                 date < new Date() || 
                                 (watchCheckInDate && date <= watchCheckInDate)
                               }
                               initialFocus
                               className="pointer-events-auto"
                             />
                           </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Duration Display */}
                {watchCheckInDate && watchCheckOutDate && (
                  <div className="bg-primary/10 rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-semibold text-lg">
                      {totalDays} {totalDays === 1 ? 'day' : 'days'}
                      {totalDays > 1 && `, ${totalDays - 1} ${totalDays - 1 === 1 ? 'night' : 'nights'}`}
                    </div>
                  </div>
                )}

                {/* Quick Selection Buttons */}
                <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (watchCheckInDate) {
                        form.setValue("checkOutDate", watchCheckInDate);
                      }
                    }}
                    className="w-full md:w-auto"
                  >
                    1 Day
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (watchCheckInDate) {
                        form.setValue("checkOutDate", addDays(watchCheckInDate, 2));
                      }
                    }}
                    className="w-full md:w-auto"
                  >
                    3 Days
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (watchCheckInDate) {
                        form.setValue("checkOutDate", addDays(watchCheckInDate, 6));
                      }
                    }}
                    className="w-full md:w-auto"
                  >
                    1 Week
                  </Button>
                </div>
              </div>

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

              {/* Advance Payment Info */}
              {providerAdvanceSettings.requiresAdvance && (
                <Alert className="border-ceremonial-gold/20 bg-ceremonial-cream/30">
                  <AlertCircle className="h-4 w-4 text-ceremonial-maroon" />
                  <AlertDescription className="text-ceremonial-maroon">
                    <div className="space-y-2">
                      <p className="font-medium">This provider requires advance payment</p>
                      <div className="text-sm space-y-1">
                        {watchPaymentPreference === 'pay_now' ? (
                          <>
                            <p>• You will pay {providerAdvanceSettings.percentage}% advance now (₹{advanceAmount})</p>
                            <p>• Remaining {100 - providerAdvanceSettings.percentage}% (₹{finalAmount}) will be charged later</p>
                            <p className="text-xs text-muted-foreground">Advance payment is non-refundable as per cancellation policy</p>
                          </>
                        ) : (
                          <>
                            <p>• Customer should prepare {providerAdvanceSettings.percentage}% advance (₹{advanceAmount})</p>
                            <p>• Remaining {100 - providerAdvanceSettings.percentage}% (₹{finalAmount}) can be paid on completion</p>
                            <p className="text-xs text-muted-foreground">Advance payment will be non-refundable</p>
                          </>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Pricing Breakdown */}
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base price per day:</span>
                    <span className="text-sm">₹{provider.base_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Number of days:</span>
                    <span className="text-sm">{totalDays}</span>
                  </div>
                  
                  {providerAdvanceSettings.requiresAdvance && watchPaymentPreference === 'pay_now' ? (
                    <>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm font-medium">Advance Payment ({providerAdvanceSettings.percentage}%):</span>
                        <span className="text-sm font-medium text-ceremonial-maroon">₹{advanceAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Remaining amount:</span>
                        <span className="text-xs text-muted-foreground">₹{finalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center font-semibold border-t pt-2 text-lg">
                        <span>Pay Now:</span>
                        <span className="text-primary">₹{advanceAmount.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center font-semibold border-t pt-2 text-lg">
                      <span>Total Price:</span>
                      <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  )}
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
            {isSubmitting ? "Processing..." : 
              providerAdvanceSettings.requiresAdvance && watchPaymentPreference === 'pay_now' 
                ? `Pay Advance - ₹${advanceAmount.toFixed(2)}`
                : `Book Service - ₹${totalPrice.toFixed(2)}`
            }
          </Button>
        </DialogFooter>
      </MobileOptimizedDialogContent>
    </Dialog>
  );
};

export default BookingDialog;