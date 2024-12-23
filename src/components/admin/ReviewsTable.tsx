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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar, Search, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReviewsTable = () => {
  const { toast } = useToast();
  const [dateSearch, setDateSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: reviews, refetch } = useQuery({
    queryKey: ["admin-reviews", dateSearch, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select(`
          *,
          profiles:user_id (full_name, email),
          service_providers:provider_id (business_name)
        `);

      if (dateSearch) {
        const searchDate = new Date(dateSearch);
        query = query.gte('created_at', searchDate.toISOString())
          .lt('created_at', new Date(searchDate.setDate(searchDate.getDate() + 1)).toISOString());
      }

      query = query.order('created_at', { ascending: sortDirection === 'asc' });

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch reviews",
        });
        return [];
      }

      return data;
    },
  });

  const handleStatusUpdate = async (reviewId: string, newStatus: string) => {
    const { error } = await supabase
      .from("reviews")
      .update({ status: newStatus })
      .eq("id", reviewId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update review status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Review status updated successfully",
    });
    refetch();
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="date"
            value={dateSearch}
            onChange={(e) => setDateSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortDirection}
          className="flex items-center gap-2"
        >
          {sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Provider</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews?.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.service_providers?.business_name}</TableCell>
                <TableCell>{review.profiles?.full_name}</TableCell>
                <TableCell>{review.rating}/5</TableCell>
                <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                <TableCell>
                  {format(new Date(review.created_at), "PPp")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      review.status === "approved"
                        ? "success"
                        : review.status === "rejected"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {review.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(review.id, "approved")}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(review.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReviewsTable;