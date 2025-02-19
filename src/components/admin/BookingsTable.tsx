
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const BookingsTable = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, isLoading: sessionLoading } = useSessionContext();
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .single();

      if (profile?.user_type !== "admin") {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to view this page.",
        });
        navigate("/");
      }
    };

    if (!sessionLoading) {
      checkAdminAccess();
    }
  }, [session, sessionLoading, navigate, toast]);

  const { data: bookings, isLoading: bookingsLoading, error } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          created_at,
          service_date,
          status,
          time_slot,
          special_requirements,
          user_id,
          provider_id,
          profiles (
            full_name,
            email,
            phone
          ),
          service_providers (
            business_name,
            service_type,
            base_price
          ),
          payments (
            amount,
            payment_type,
            status
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch bookings. Please try again.",
        });
        throw error;
      }
      return data;
    },
    enabled: !!session?.user,
  });

  if (sessionLoading || bookingsLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load bookings. Please try again later.
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service Provider</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                {format(new Date(booking.service_date), "PPP")}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{booking.profiles?.full_name}</p>
                  <p className="text-sm text-gray-500">{booking.profiles?.email}</p>
                </div>
              </TableCell>
              <TableCell>{booking.service_providers?.business_name}</TableCell>
              <TableCell>{booking.service_providers?.service_type}</TableCell>
              <TableCell>
                <div>
                  <p>₹{booking.payments?.[0]?.amount || "N/A"}</p>
                  <p className="text-sm text-gray-500">
                    {booking.payments?.[0]?.payment_type || "Not specified"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    booking.status === "confirmed"
                      ? "default"
                      : booking.status === "cancelled"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {booking.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {!bookings?.length && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No bookings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
