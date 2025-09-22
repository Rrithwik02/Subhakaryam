import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PaymentRequestButton from "./PaymentRequestButton";

interface Milestone {
  percentage: number;
  description: string;
  due_date: string | null;
  completed?: boolean;
}

interface PaymentSchedule {
  id: string;
  booking_id: string;
  payment_plan: string;
  total_milestones: number;
  milestones: any; // JSONB from database
  current_milestone: number;
  created_at: string;
  updated_at: string;
}

interface PaymentScheduleTrackerProps {
  bookingId: string;
  totalAmount: number;
}

const PaymentScheduleTracker = ({ bookingId, totalAmount }: PaymentScheduleTrackerProps) => {
  const [schedule, setSchedule] = useState<PaymentSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentSchedule();
  }, [bookingId]);

  const fetchPaymentSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_schedules")
        .select("*")
        .eq("booking_id", bookingId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create default payment schedule
        await createDefaultSchedule();
      } else {
        setSchedule({
          ...data,
          milestones: Array.isArray(data.milestones) ? data.milestones : JSON.parse(data.milestones as string)
        });
      }
    } catch (error) {
      console.error("Error fetching payment schedule:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load payment schedule",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_schedules")
        .insert({
          booking_id: bookingId,
          payment_plan: "standard",
          total_milestones: 2,
          milestones: [
            { percentage: 50, description: "Advance payment", due_date: null },
            { percentage: 50, description: "Final payment", due_date: null }
          ]
        })
        .select()
        .single();

      if (error) throw error;
      setSchedule({
        ...data,
        milestones: Array.isArray(data.milestones) ? data.milestones : JSON.parse(data.milestones as string)
      });
    } catch (error) {
      console.error("Error creating payment schedule:", error);
    }
  };

  const calculateProgress = () => {
    if (!schedule) return 0;
    return ((schedule.current_milestone - 1) / schedule.total_milestones) * 100;
  };

  const getCurrentMilestone = () => {
    if (!schedule) return null;
    return schedule.milestones[schedule.current_milestone - 1];
  };

  const getMilestoneAmount = (percentage: number) => {
    return (totalAmount * percentage) / 100;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!schedule) return null;

  const currentMilestone = getCurrentMilestone();
  const isCompleted = schedule.current_milestone > schedule.total_milestones;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Payment Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{schedule.current_milestone}/{schedule.total_milestones} milestones</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        {/* Current Milestone */}
        {!isCompleted && currentMilestone && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Current: {currentMilestone.description}
              </h3>
              <Badge variant="outline">
                ₹{getMilestoneAmount(currentMilestone.percentage).toLocaleString()}
              </Badge>
            </div>
            
            {currentMilestone.due_date && (
              <p className="text-sm text-muted-foreground mb-3">
                Due: {new Date(currentMilestone.due_date).toLocaleDateString()}
              </p>
            )}

            <PaymentRequestButton
              bookingId={bookingId}
              amount={getMilestoneAmount(currentMilestone.percentage)}
              paymentType={schedule.current_milestone === 1 ? "advance" : "final"}
              description={currentMilestone.description}
              onPaymentSuccess={() => {
                setSchedule(prev => prev ? {
                  ...prev,
                  current_milestone: prev.current_milestone + 1
                } : null);
              }}
            />
          </div>
        )}

        {/* All Milestones */}
        <div className="space-y-3">
          <h4 className="font-semibold">All Milestones</h4>
          {schedule.milestones.map((milestone, index) => {
            const milestoneNumber = index + 1;
            const isCompleted = milestoneNumber < schedule.current_milestone;
            const isCurrent = milestoneNumber === schedule.current_milestone;
            
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 border rounded ${
                  isCompleted ? "bg-green-50 border-green-200" :
                  isCurrent ? "bg-blue-50 border-blue-200" :
                  "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : isCurrent ? (
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                  )}
                  <div>
                    <p className="font-medium">{milestone.description}</p>
                    {milestone.due_date && (
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(milestone.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={isCompleted ? "default" : "outline"}>
                  ₹{getMilestoneAmount(milestone.percentage).toLocaleString()}
                </Badge>
              </div>
            );
          })}
        </div>

        {isCompleted && (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Payment Schedule Completed</p>
            <p className="text-sm text-green-600">All milestones have been fulfilled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleTracker;