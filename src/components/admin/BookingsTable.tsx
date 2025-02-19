
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const BookingsTable = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          ),
          service_providers:provider_id (
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

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading bookings...</div>;
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
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
