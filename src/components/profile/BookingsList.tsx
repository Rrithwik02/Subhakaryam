
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CancellationForm from "@/components/bookings/CancellationForm";

interface Booking {
  id: string;
  service_date: string;
  time_slot: string;
  status: string;
  special_requirements?: string;
  refund_amount?: number;
  profiles?: {
    id?: string;
    full_name?: string;
    email?: string;
  };
  service_providers?: {
    business_name?: string;
    service_type?: string;
    profile_id?: string;
  };
  payments?: Array<{
    amount: number;
    payment_type: string;
    status: string;
  }>;
}

interface BookingsListProps {
  bookings?: Booking[];
  isServiceProvider?: boolean;
  onBookingUpdate?: () => void;
}

const BookingsList = ({ bookings, isServiceProvider, onBookingUpdate }: BookingsListProps) => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const handleCancellation = async (bookingId: string) => {
    setSelectedBooking(bookingId);
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bookings found
      </div>
    );
  }

  const getBookingPaymentInfo = (booking: Booking) => {
    if (!booking.payments || booking.payments.length === 0) {
      return { amount: 0, paymentType: 'None' };
    }
    const payment = booking.payments[0];
    return {
      amount: payment.amount,
      paymentType: payment.payment_type,
    };
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {isServiceProvider
                    ? booking.profiles?.full_name
                    : booking.service_providers?.business_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {isServiceProvider
                    ? booking.profiles?.email
                    : booking.service_providers?.service_type}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(booking.service_date), "PPP")}
                  </span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>
                    {format(new Date(`2000-01-01T${booking.time_slot}`), "p")}
                  </span>
                </div>
                {booking.special_requirements && (
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Special Requirements:</strong>{" "}
                    {booking.special_requirements}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Badge
                  variant={
                    booking.status === "pending"
                      ? "default"
                      : booking.status === "confirmed"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {booking.status}
                </Badge>
                {booking.status !== 'cancelled' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCancellation(booking.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedBooking && (
        <CancellationForm
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          bookingId={selectedBooking}
          {...getBookingPaymentInfo(bookings.find(b => b.id === selectedBooking)!)}
          onCancellationComplete={() => {
            if (onBookingUpdate) {
              onBookingUpdate();
            }
          }}
        />
      )}
    </div>
  );
};

export default BookingsList;
