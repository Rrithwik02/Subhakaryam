
import React, { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AvailabilityCalendar = ({ providerId }: { providerId: string }) => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const { data: availability, isLoading } = useQuery({
    queryKey: ["availability", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_provider_availability")
        .select("*")
        .eq("provider_id", providerId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch availability",
        });
        return [];
      }

      return data;
    },
    enabled: !!providerId,
  });

  const updateAvailability = useMutation({
    mutationFn: async () => {
      // Check if we already have 7 days set
      if (availability && availability.length >= 7 && !availability.some(slot => slot.day_of_week === selectedDay)) {
        throw new Error("Maximum 7 days of availability can be set");
      }

      const { error } = await supabase
        .from("service_provider_availability")
        .upsert({
          provider_id: providerId,
          day_of_week: selectedDay,
          start_time: startTime,
          end_time: endTime,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast({
        title: "Success",
        description: "Availability updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update availability",
      });
    },
  });

  const deleteAvailability = useMutation({
    mutationFn: async (slotId: string) => {
      const { error } = await supabase
        .from("service_provider_availability")
        .delete()
        .eq("id", slotId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast({
        title: "Success",
        description: "Availability slot deleted successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete availability slot",
      });
    },
  });

  const handleSave = () => {
    updateAvailability.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceremonial-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-ceremonial-maroon">
        Manage Availability
      </h3>
      
      <div className="grid gap-4">
        <div>
          <Label>Day of Week</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
          >
            {daysOfWeek.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label>End Time</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={handleSave}
          className="w-full bg-ceremonial-gold hover:bg-ceremonial-gold/90"
        >
          Save Availability
        </Button>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Current Availability</h4>
        <div className="border rounded-md p-4">
          {availability && availability.length > 0 ? (
            <ul className="space-y-2">
              {availability.map((slot) => (
                <li key={slot.id} className="flex justify-between items-center text-sm">
                  <span>{daysOfWeek[slot.day_of_week]}</span>
                  <div className="flex items-center gap-4">
                    <span>
                      {slot.start_time} - {slot.end_time}
                    </span>
                    <button
                      onClick={() => deleteAvailability.mutate(slot.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              No availability set yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
